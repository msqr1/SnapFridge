import { styled } from "@pigment-css/react";

export type SpoonacularRecipe = {
  id: number;
  image: string;
  imageType: string;
  title: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  veryHealthy: boolean;
  cheap: boolean;
  veryPopular: boolean;
  sustainable: boolean;
  lowFodmap: boolean;
  weightWatcherSmartPoints: number;
  gaps: string;
  preparationMinutes: number | null;
  cookingMinutes: number | null;
  aggregateLikes: number;
  healthScore: number;
  creditsText: string;
  license: string;
  sourceName: string;
  pricePerServing: number;

  extendedIngredients: {
    id: number;
    aisle: string;
    image: string;
    consistency: string;
    name: string;
    nameClean: string;
    original: string;
    originalName: string;
    amount: number;
    unit: string;
    meta: string[];
    measures: {
      us: {
        amount: number;
        unitShort: string;
        unitLong: string;
      };
      metric: {
        amount: number;
        unitShort: string;
        unitLong: string;
      };
    };
  }[];

  nutrition: {
    nutrients: {
      name: string;
      amount: number;
      unit: string;
      percentOfDailyNeeds: number;
    }[];

    caloricBreakdown: {
      percentProtein: number;
      percentFat: number;
      percentCarbs: number;
    };

    weightPerServing: {
      amount: number;
      unit: string;
    };
  };

  summary: string;
  cuisines: string[];
  dishTypes: string[];
  diets: string[];
  occasions: string[];

  analyzedInstructions: {
    name: string;
    steps: {
      number: number;
      step: string;
      ingredients: {
        id: number;
        name: string;
        localizedName: string;
        image: string;
      }[];
      length?: {
        number: number;
        unit: string;
      };
    }[];
  }[];

  spoonacularScore: number;
  spoonacularSourceUrl: string;
};

export default function RecipeInfo({ recipeInfo }: { recipeInfo: SpoonacularRecipe }) {
  return (
    <div>
      <Summary dangerouslySetInnerHTML={{ __html: recipeInfo.summary }} />

      <CookingInfoContainer>
        <CookingInfo>
          <CookingInfoTitle>Total Time:</CookingInfoTitle>
          <CookingInfoText>{recipeInfo.readyInMinutes} minutes</CookingInfoText>
        </CookingInfo>
        <CookingInfo>
          <CookingInfoTitle>Cooking:</CookingInfoTitle>
          <CookingInfoText>{recipeInfo.cookingMinutes} minutes</CookingInfoText>
        </CookingInfo>
        <CookingInfo>
          <CookingInfoTitle>Preparation:</CookingInfoTitle>
          <CookingInfoText>{recipeInfo.preparationMinutes} minutes</CookingInfoText>
        </CookingInfo>
        <CookingInfo>
          <CookingInfoTitle>Ingredients:</CookingInfoTitle>
          <CookingInfoText>{recipeInfo.extendedIngredients.length}</CookingInfoText>
        </CookingInfo>
        <CookingInfo>
          <CookingInfoTitle>Servings:</CookingInfoTitle>
          <CookingInfoText>{recipeInfo.servings}</CookingInfoText>
        </CookingInfo>
      </CookingInfoContainer>
    </div>
  );
}

const Summary = styled("p")({});

const CookingInfoContainer = styled("div")({});
const CookingInfo = styled("div")({});
const CookingInfoTitle = styled("h2")({});
const CookingInfoText = styled("p")({});
