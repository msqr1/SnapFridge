"use client";

import {
  createContext,
  useContext,
  useMemo,
  type Dispatch,
  type PropsWithChildren,
} from "react";
import { enableMapSet } from "immer";
import { useImmerReducer } from "use-immer";
import { type Ingredient, type Recipe } from "@components/Global";

enableMapSet();

export interface State {
  ingredients: Map<string, Ingredient>;
  files: File[];
  recipes: "pending" | Recipe[];
}

export type Action =
  | { type: "addIngredient"; ingredient: Ingredient }
  | { type: "addIngredients"; ingredients: Ingredient[] }
  | { type: "removeIngredient"; ingredient: Ingredient }
  | { type: "editIngredient"; old: Ingredient; new: Ingredient }
  | { type: "addFiles"; files: File[] }
  | { type: "removeFile"; index: number }
  | { type: "addRecipes"; recipes: Recipe[] }
  | { type: "setPendingSpoonacular" };

function reducer(draft: State, action: Action) {
  function addIngredient({ name, amount, unit }: Ingredient) {
    const key = `${name}-${unit}`;
    if (draft.ingredients.has(key)) {
      draft.ingredients.get(key)!.amount += amount;
    } else {
      draft.ingredients.set(key, { name, amount, unit });
    }
  }
  function removeIngredient({ name, unit }: Ingredient) {
    const key = `${name}-${unit}`;
    draft.ingredients.delete(key);
  }

  switch (action.type) {
    case "addIngredient": {
      addIngredient(action.ingredient);
      break;
    }
    case "addIngredients": {
      for (const ingredient of action.ingredients) {
        addIngredient(ingredient);
      }
      break;
    }
    case "removeIngredient": {
      removeIngredient(action.ingredient);
      break;
    }
    case "editIngredient": {
      removeIngredient(action.old);
      addIngredient(action.new);
      break;
    }
    case "addFiles": {
      draft.files.push(...action.files);
      break;
    }
    case "removeFile": {
      draft.files.splice(action.index, 1);
      break;
    }
    case "addRecipes": {
      if (draft.recipes === "pending") {
        draft.recipes = [];
      }
      draft.recipes.push(...action.recipes);
      break;
    }
    case "setPendingSpoonacular": {
      draft.recipes = "pending";
      break;
    }
  }
}

type InputContext = {
  dispatch: Dispatch<Action>;
  state: State;
};

const InputContext = createContext<InputContext | undefined>(undefined);

export function InputProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useImmerReducer(reducer, {
    ingredients: new Map<string, Ingredient>(),
    files: [],
    recipes: [],
    pendingSpoonacular: false,
  });

  const value = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  return <InputContext value={value}>{children}</InputContext>;
}

export function useInputState() {
  return useContext(InputContext)!;
}
