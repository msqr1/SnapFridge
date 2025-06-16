"use client";

import { useState } from "react";
import { styled } from "@pigment-css/react";
import Icon from "@components/Icon";
import Ingredient from "./Ingredient";
import { motion } from "motion/react";

function IngredientSection() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [input, setInput] = useState<string>("");

  function addIngredient() {
    if (input !== "") {
      setIngredients([
        ...ingredients,
        { name: input, quantity: 3, measurement: "tsp" },
      ]);
      setInput("");
    }
  }

  function removeIngredient(name: string) {
    const nextIngredients = ingredients.filter(
      (ingredient) => ingredient.name !== name
    );
    setIngredients(nextIngredients);
  }

  //function editIngredient(name: string, newInfo: unknown) {
  //}

  if (!ingredients.length) {
    return (
      <>
        <NoIngredientsContainer>
          <Icon icon="Archive" size={36} color="var(--hero-linear-1)" />
          <IngredientsTitle>Your ingredients will appear here</IngredientsTitle>
        </NoIngredientsContainer>

        <form>
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            required
          />
          <button onClick={addIngredient}>Add</button>
        </form>
      </>
    );
  }

  return (
    <>
      <IngredientsContainer
        layout
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {ingredients.map((ingredient: Ingredient) => (
          // Temporary key as a placeholder. actual key will be the ingredient name
          <Ingredient
            key={ingredient.name}
            ingredientInfo={ingredient}
            removeIngredient={removeIngredient}
          ></Ingredient>
        ))}
      </IngredientsContainer>

      <form>
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          required
        />
        <button onClick={addIngredient}>Add</button>
      </form>
    </>
  );
}

const NoIngredientsContainer = styled("div")({
  marginTop: "36px",

  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",

  gap: "12px",
  padding: "24px",
  border: "1px solid var(--hero-linear-1)",
  borderRadius: "8px",
  color: "var(--hero-linear-1)",

  maxWidth: "450px",
  width: "100%",
  height: "fit-content",
  minHeight: "220px",
});

const IngredientsTitle = styled("h1")({
  fontSize: `${18 / 16}rem`,
  fontWeight: "400",
  textAlign: "center",
});

const IngredientsContainer = styled(motion.ul)({
  marginTop: "36px",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexWrap: "wrap",

  gap: "12px",
  padding: "24px",
  border: "1px solid var(--accent-400)",
  borderRadius: "8px",
  color: "var(--text-950)",

  maxWidth: "600px",
  minWidth: "450px",
  width: "fit-content",
  height: "fit-content",
  minHeight: "220px",

  listStyleType: "none",
});

export default IngredientSection;
