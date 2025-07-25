"use client";

import { styled } from "@pigment-css/react";
import { type ComponentProps, useState, useEffect } from "react";

export default function VisuallyHidden({
  children,
  ...delegated
}: ComponentProps<"span">) {
  const [forceShow, setForceShow] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      return;
    }
    const handleKeyDown = (ev: globalThis.KeyboardEvent) => {
      if (ev.shiftKey && ev.altKey) {
        setForceShow(true);
      }
    };

    const handleKeyUp = (ev: globalThis.KeyboardEvent) => {
      if (ev.shiftKey || ev.altKey) {
        setForceShow(false);
      }
    };

    addEventListener("keydown", handleKeyDown);
    addEventListener("keyup", handleKeyUp);

    return () => {
      removeEventListener("keydown", handleKeyDown);
      removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  if (forceShow) {
    return children;
  }
  return <Hidden {...delegated}>{children}</Hidden>;
}

const Hidden = styled("span")({
  position: "absolute",
  width: "1px",
  height: "1px",
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",

  "&:focus, &:active": {
    position: "static",
    width: "auto",
    height: "auto",
    overflow: "visible",
    clip: "auto",
    clipPath: "none",
    whiteSpace: "normal",
  },
});
