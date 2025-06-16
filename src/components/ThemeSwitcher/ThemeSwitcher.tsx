"use client";

import { type ComponentProps, useEffect, useState } from "react";
import Button from "@components/Button";
import { styled } from "@pigment-css/react";
import VisuallyHidden from "@components/VisuallyHidden";
import { DropdownMenu } from "radix-ui";
import Icon from "@components/Icon";

interface Props extends ComponentProps<"button"> {
  mobile?: boolean;
}

function ThemeSwitcher({ mobile = false, ...delegated }: Props) {
  const [currentTheme, setTheme] = useState("");
  useEffect(() => {
    const theme = localStorage.getItem("theme") ||
      (matchMedia("prefers-color-scheme: light") ? "light" : "dark");
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.display = "block";
  }, []);

  function toggleTheme() {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    localStorage.setItem("theme", newTheme)
    document.documentElement.setAttribute("data-theme", newTheme);
    setTheme(newTheme);
  }
  
  const children = (
    <>
      <VisuallyHidden>
        {currentTheme === "dark" ? "Turn On Light Mode" : "Turn On Dark Mode"}
      </VisuallyHidden>
      <Icon icon={currentTheme === "dark" ? "Moon" : "Sun"} />
    </>
  );
  if (mobile) {
    return (
      <DropdownMenu.Item onSelect={toggleTheme}>{children}</DropdownMenu.Item>
    );
  }

  return (
    <ThemeSwitchBtn onClick={toggleTheme} {...delegated}>
      {children}
    </ThemeSwitchBtn>
  );
}

const ThemeSwitchBtn = styled(Button)({
  backgroundColor: "transparent",

  "&:hover": {
    backgroundColor: "var(--background-100)",
  },
});

export default ThemeSwitcher;
