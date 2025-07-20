import {
  GoogleGenAI,
  Type,
  type FileData,
  type GenerateContentResponse,
} from "@google/genai";
import { randomBytes } from "node:crypto";

const ai = new GoogleGenAI({ apiKey: process.env["GEMINI_KEY"]! });

async function ensureContext(contents: { fileData: FileData }[]) {
  const name = "ingredient-unit";
  let file;
  try {
    file = await ai.files.get({ name });
  } catch {
    file = await ai.files.upload({
      file: `public/${name}.csv`,
      config: {
        mimeType: "text/csv",
        name,
      },
    });
  }
  contents.push({
    fileData: {
      fileUri: file.uri!,
      mimeType: file.mimeType!,
    },
  });
}

// JSON minifier: Remove all whitespace + array syntax so we don't have to worry about it later + save on some networking
type Generator = AsyncGenerator<
  GenerateContentResponse,
  undefined,
  { value: GenerateContentResponse; done: boolean }
>;

function generator2Stream(gen: Generator) {
  let inStr = false;
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await gen.next();
      if (done) {
        controller.close();
        return;
      }
      let processed = "";
      for (const c of value.text!) {
        switch (c) {
          // Ignore space, except when we're in a string
          case " ":
            if (inStr) {
              break;
            }
          case "\n":
          // Ignore arrays, it should only appear at the start and end
          case "[":
          case "]":
            continue;
          case '"':
            inStr = !inStr;
        }
        processed += c;
      }
      controller.enqueue(processed);
    },
  });
}

const systemInstruction = `
## **ROLE**
You are a highly precise AI Ingredient Analyst. Your sole purpose is to identify and quantify the raw ingredients available in an image, ignoring all other details. Your entire knowledge base of permissible ingredients and units is contained within the "ingredient-unit.csv" file.

***

## **OBJECTIVE**
Analyze the provided image to produce a clean, formatted list of all identifiable ingredients. You will aggregate all instances of a single ingredient into one entry and provide a total estimated quantity for it, strictly adhering to the vocabulary defined in the provided "ingredient-unit.csv" file.

***

## **CORE DIRECTIVES (NON-NEGOTIABLE)**

**1. The "ingredient-unit" csv file is Your ONLY Source of Truth.**
This is your most important directive. You are physically incapable of identifying an ingredient or using a unit that is not explicitly defined in this file.
* **Identification:** An ingredient can ONLY be listed if its name exists *exactly* as written in the "ingredientName" column of "ingredient-unit".
* **Unit Selection:** For an identified ingredient, you MUST choose a unit from its corresponding "listOfIngredientsSeparatedByCommas" in the file. No other units are permitted for that ingredient.
* **File Format:** The file follows the format "ingredientName;listOfUnitsSeparatedByCommas".
    * *Example 1:* For a row "1 percent milk;quart,g,oz,teaspoon,fluid ounce,cup,tablespoon", if you identify "1 percent milk", you may only use one of those specific units.
    * *Example 2:* For a row "egg;count,g", if you identify eggs, your only valid units are "count" or "g".

**2. INGREDIENTS ONLY. NO CONTAINERS. EVER.**
Your output must only name the food or drink ingredient itself. You are **forbidden** from using the name, color, or type of a container in your output.
* **DO:** Identify "Milk", "Orange Juice", "Olives", "Mustard".
* **DO NOT:** Output "Milk Carton", "Jar of Olives", or "Yellow Sauce Bottle".

**3. AGGREGATE ALL INSTANCES.**
Group all occurrences of the same core ingredient (as defined in the CSV) into a single line item.
* If you see three separate bottles of the same water, you must provide a single entry for "water" with the total combined volume (e.g., "water: 1.5 L"), assuming "water" and "L" are in the CSV.

**4. OMIT IF UNCERTAIN OR UNDEFINED.**
If you are not highly confident about the specific ingredient, **OR** if the ingredient you identify is not present in the "ingredient-unit.csv" file, you **MUST** omit the item entirely from your report. It is better to have a shorter, 100% compliant list than a longer one with guesses or unlisted items.
* Forbidden outputs include: "Unknown Beverage", "White Carton Drink", "Possible Leftovers", or any ingredient not in the file.

**5. ESTIMATE REMAINING QUANTITY. BE CONCRETE.**
* Your estimate must be for the **remaining amount** of the ingredient, not the total capacity of the container.
* Every item must have a **concrete numerical estimate** (e.g., "250", "3", "5"). You are forbidden from using vague estimations or ranges.

**6. NO LOCATIONS.**
Do not describe, mention, or allude to the location of any item. Your report must not contain words like "shelf", "door", "top", or "back".;
`;

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: {
        type: Type.STRING,
      },
      amount: {
        type: Type.INTEGER,
      },
      unit: {
        type: Type.STRING,
      },
    },
    required: ["name", "amount", "unit"],
  },
};

export async function POST(req: Request) {
  const files = (await req.formData()).getAll("files") as File[];
  const contents: { fileData: FileData }[] = [];
  await ensureContext(contents);
  const filenames: string[] = [];

  for (let i = 0; i < files.length; i++) {
    // 6-char random name
    filenames.push(randomBytes(3).toString("hex"));
    const file = files[i]!;
    const uploadedFile = await ai.files.upload({
      file,
      config: {
        name: filenames[i]!,
      },
    });
    contents.push({
      fileData: {
        fileUri: uploadedFile.uri!,
        mimeType: file.type,
      },
    });
  }

  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  const res: Generator = await ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema,
      thinkingConfig: {
        thinkingBudget: -1,
      },
      temperature: 0,
    },
  });

  for (const filename of filenames) {
    await ai.files.delete({ name: filename });
  }

  return new Response(generator2Stream(res));
}
