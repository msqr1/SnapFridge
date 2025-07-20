"use client";

import Button from "@components/Button";
import AppDialog from "@components/Dialog";
import Icon from "@components/Icon";
import { styled } from "@pigment-css/react";
import { Suspense, useState } from "react";
import IngredientForm from "../IngredientForm";
import FormSkeleton from "../FormSkeleton";

function IngredientDialog() {
  const [isOpen, setOpen] = useState(false);

  return (
    <AppDialog
      open={isOpen}
      onOpenChange={setOpen}
      title="Add Ingredient"
      trigger={
        <AddTrigger variant="icon">
          <Icon icon="Plus" description="Add ingredient" />
        </AddTrigger>
      }
    >
      <Suspense fallback={<FormSkeleton />}>
        <IngredientForm
          variant="add"
          onSubmitSuccess={() => {
            setOpen(false);
          }}
        />
      </Suspense>
    </AppDialog>
  );
}

const AddTrigger = styled(Button)({
  position: "absolute",
  top: 0,
  right: 0,
});

export default IngredientDialog;
