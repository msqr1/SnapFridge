import AppTooltip from "@components/Tooltip";
import RecipeInfo from "@components/RecipeInfo";
import { type SpoonacularRecipe } from "@components/RecipeInfo/RecipeInfo";
import Image from "next/image";
import { css, styled } from "@pigment-css/react";
import { PageMargin } from "@components/Global";
import RecipeActions from "@components/RecipeActions";
import Icon from "@components/Icon";
import RecipeInfoList from "@components/RecipeInfoList";
import RecipeStepsList from "@components/DetailedRecipe";
import { notFound } from "next/navigation";

// Revalidate the cache every hour
const CACHE_ONE_HOUR = 3600;

async function getRecipe(id: string) {
  const recipeInfoRes = await fetch(
    `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=true`,
    {
      headers: {
        "x-api-key": process.env["SPOONACULAR_KEY"]!,
      },
      next: {
        revalidate: CACHE_ONE_HOUR,
      },
    }
  );

  if (!recipeInfoRes.ok) {
    if (recipeInfoRes.status === 404) {
      return null;
    }

    const errorDetails = await recipeInfoRes.text();
    throw new Error(
      `Failed to fetch recipe ${id}: ${recipeInfoRes.status} ${recipeInfoRes.statusText} - ${errorDetails}`
    );
  }

  const recipeInfo = (await recipeInfoRes.json()) as SpoonacularRecipe;

  if (!recipeInfo || Object.keys(recipeInfo).length === 0) {
    return null;
  }
  return recipeInfo;
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipeInfo = await getRecipe(id);

  // Send to not-found.tsx
  if (!recipeInfo) notFound();

  return (
    <>
      <figure>
        <Image
          className={RecipeImage}
          src={recipeInfo.image}
          alt={recipeInfo.title}
          width={556}
          height={370}
          quality={90}
        />
        <SourceCredit>
          Source: <Link href={recipeInfo.sourceUrl}>{recipeInfo.creditsText}</Link>
        </SourceCredit>
      </figure>
      <PageMargin>
        <TitleSection>
          <Title>{recipeInfo.title}</Title>
          {recipeInfo.vegan && <AppTooltip type="vegan" />}
          {recipeInfo.vegetarian && <AppTooltip type="vegetarian" />}
          {recipeInfo.sustainable && <AppTooltip type="sustainable" />}
          {recipeInfo.veryHealthy && <AppTooltip type="healthy" />}
          {recipeInfo.veryPopular && <AppTooltip type="popular" />}
        </TitleSection>
        {/* <MobileRecipeActions></MobileRecipeActions> */}
        <AllergenWarning>
          <Icon
            icon="TriangleAlert"
            color="var(--warn-500)"
            size={32}
            description="Warning"
          />
          <AllergenContent>
            <AllergenTitle>Possible Allergens</AllergenTitle>
            <AllergenText>
              {!recipeInfo.dairyFree && "Dairy,"}
              {!recipeInfo.glutenFree && "Gluten,"}
            </AllergenText>
          </AllergenContent>
        </AllergenWarning>

        <Wrapper>
          <RecipeInfo recipeInfo={recipeInfo} />
          <RecipeActions />
        </Wrapper>

        <RecipeInfoList ingredients={recipeInfo.extendedIngredients} />

        <RecipeStepsList recipes={recipeInfo} />

        <>
          <p>testing: </p>
          <AppTooltip type="vegan"></AppTooltip>
          <AppTooltip type="vegetarian"></AppTooltip>
          <AppTooltip type="sustainable"></AppTooltip>
          <AppTooltip type="healthy"></AppTooltip>
          <AppTooltip type="popular"></AppTooltip>
        </>
      </PageMargin>
    </>
  );
}

const RecipeImage = css({
  width: "100vw",
  height: "min(362px, 50vh)",
  objectFit: "cover",
  opacity: "60%",
});

const SourceCredit = styled("small")({
  display: "block",
  marginLeft: "auto",
  width: "fit-content",
  marginRight: "36px",
  fontSize: `${14 / 16}rem`,
});

const Link = styled("a")({
  color: "var(--text-950)",

  "&:hover": {
    textDecoration: "none",
  },
});

const TitleSection = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "24px",
});

const Title = styled("h1")({
  fontSize: `${30 / 16}rem`,
  marginTop: "5px",
});

const Wrapper = styled("div")({
  display: "flex",
  gap: "16px",
});

const AllergenWarning = styled("section")({
  padding: "12px 24px",
  width: "fit-content",
  display: "flex",
  alignItems: "center",
  position: "relative",
  gap: "24px",
  borderLeft: "2px solid var(--warn-600)",

  "&::before": {
    content: "''",
    position: "absolute",
    borderTopRightRadius: "8px",
    borderBottomRightRadius: "8px",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "var(--warn-500)",
    opacity: "30%",
    zIndex: -1,
  },
});

const AllergenContent = styled("div")({});
const AllergenTitle = styled("h2")({});
const AllergenText = styled("p")({});
