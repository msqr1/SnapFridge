"use client";

import { useState, type PropsWithChildren, type ReactNode } from "react";
import { Toast } from "radix-ui";
import { styled } from "@pigment-css/react";
import Icon, { type IconType } from "@components/Icon";
import Button from "@components/Button";
import { type Variants, motion } from "motion/react";

type Props = {
  id: string;
  variant: "success" | "warn" | "error" | "info";
  title: ReactNode;
  removeToast: (id: string) => void;
};

function AppToast({
  id,
  variant,
  title,
  removeToast,
  children,
}: PropsWithChildren<Props>) {
  const [open, setOpen] = useState(true);

  let iconName: IconType;
  switch (variant) {
    case "success":
      iconName = "Check";
      break;
    case "warn":
      iconName = "CircleAlert";
      break;
    case "error":
      iconName = "CircleX";
      break;
    default:
      iconName = "Info";
  }

  return (
    <Toast.Root
      open={open}
      onOpenChange={(open: boolean) => {
        if (!open) {
          removeToast(id);
        }
      }}
      asChild
      forceMount
    >
      <ContentContainer
        layout
        variant={variant}
        variants={ToastVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        transition={{ type: "spring", damping: 20, stiffness: 150 }}
      >
        <Icon icon={iconName} />
        <MainContent>
          <Title>{title}</Title>
          <Description>{children}</Description>
          <Toast.Close
            onClick={() => {
              setOpen(false);
            }}
            asChild
          >
            <Close variant="icon">
              <Icon icon="X" color="var(--text-950)" description="Close" />
            </Close>
          </Toast.Close>
        </MainContent>
      </ContentContainer>
    </Toast.Root>
  );
}

const ToastVariants: Variants = {
  initial: {
    x: "100%",
    opacity: 0,
  },
  enter: {
    x: 0,
    opacity: 1,
  },
  exit: {
    x: "100%",
    opacity: 0,
  },
};

const ContentContainer = styled(motion.li)<{
  variant: "success" | "warn" | "error" | "info";
}>({
  display: "flex",
  alignItems: "center",
  gap: "16px",
  width: "100%",
  minHeight: "80px",
  height: "fit-content",
  maxHeight: "200px",
  overflowY: "auto",
  borderRadius: "16px",
  padding: "16px",
  boxShadow: "var(--shadow)",
  listStyle: "none",

  variants: [
    {
      props: { variant: "success" },
      style: {
        background: "var(--success-50)",
      },
    },
    {
      props: { variant: "warn" },
      style: {
        background: "var(--warn-50)",
      },
    },
    {
      props: { variant: "error" },
      style: {
        background: "var(--error-50)",
      },
    },
    {
      props: { variant: "info" },
      style: {
        background: "var(--background-100)",
      },
    },
  ],
});

const MainContent = styled("div")({
  flex: 1,
  display: "grid",
  gridTemplateAreas: `
    "title close"
    "description close"
  `,
  gridTemplateColumns: "minmax(0, 1fr) auto",
  columnGap: "16px",
  rowGap: "4px",
});

const Title = styled(Toast.Title)({
  gridArea: "title",
  fontWeight: 700,
  fontSize: `${18 / 16}rem`,
});

const Description = styled(Toast.Description)({
  gridArea: "description",
  fontSize: `${16 / 16}rem`,
  color: "var(--text-900)",
});

const Close = styled(Button)({
  borderRadius: "50%",
  gridArea: "close",
  alignSelf: "start",
});

export default AppToast;
