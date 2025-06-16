import "@pigment-css/react/styles.css";
import "./globalStyles";
import { Poppins } from "next/font/google";
import NavBar from "@components/NavBar";
import Footer from "@components/Footer";
import CookieBanner from "@components/CookieBanner";
import { styled } from "@pigment-css/react";

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "SnapFridge",
  description: "Delicious recipes right from your fridge",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.className} style={{ display: "none" }}>
      <body>
        <Background>
          <NavBar></NavBar>
          <Main>{children}</Main>
          <Footer></Footer>
          <CookieBanner></CookieBanner>
        </Background>
      </body>
    </html>
  );
}
const Background = styled("div")({
  display: "flex",
  flexDirection: "column",
  minHeight: "100%",
  color: "var(--text-950)",
  background: "var(--background-0)",
  isolation: "isolate",
});

const Main = styled("main")({
  flex: 1,
});
