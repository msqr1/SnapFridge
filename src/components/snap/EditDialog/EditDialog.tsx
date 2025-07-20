import AppDialog from "@components/Dialog";
import IngredientForm from "../IngredientForm";
import { Suspense, type PropsWithChildren } from "react";
import FormSkeleton from "../FormSkeleton";
import type { Ingredient } from "@components/Global";

interface Props extends PropsWithChildren {
  ingredient: Ingredient;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function EditDialog({ ingredient, open, onOpenChange }: Props) {
  return (
    <AppDialog
      title="Edit Ingredient"
      trigger={null}
      open={open}
      onOpenChange={onOpenChange}
    >
      <Suspense fallback={<FormSkeleton />}>
        <IngredientForm
          defaultAmount={ingredient.amount}
          defaultIngredient={ingredient.name}
          defaultUnit={ingredient.unit}
          variant="edit"
          onSubmitSuccess={() => {
            onOpenChange(false);
          }}
        />
      </Suspense>
    </AppDialog>
  );
}

export default EditDialog;
