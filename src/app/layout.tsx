import "@pigment-css/react/styles.css";
import "./GlobalStyles";
import { Poppins } from "next/font/google";
import NavBar from "@components/NavBar";
import Footer from "@components/Footer";
import CookieBanner from "@components/CookieBanner";
import { type PropsWithChildren } from "react";

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "fallback",
});

// Not a function to save on code size
const applyTheme = () => {
  const theme =
    localStorage.getItem("theme") ||
    (matchMedia("(prefers-color-scheme: dark)") ? "dark" : "light");
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  }
  addEventListener("beforeunload", () => {
    localStorage.setItem(
      "theme",
      `${document.documentElement.classList.contains("dark") ? "dark" : "light"}`
    );
  });
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={poppins.className} suppressHydrationWarning>
      <body>
        <script>{`(${applyTheme.toString()})()`}</script>
        <NavBar />
        <main>{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
