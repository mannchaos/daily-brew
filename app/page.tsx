import { BrewScreen } from "./_components/BrewScreen";
import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Daily Brew",
  description: "Minimal French Press Companion",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Daily Brew",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#fdfbf7",
};

export default function Home() {
  return (
    <main>
      <BrewScreen />
    </main>
  );
}
