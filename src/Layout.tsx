import { type JSX } from "solid-js";
import HeroSection from "./components/Hero";
import Tabs from "./components/Tabs";
import Footer from "./components/Footer";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { t } from "./i18n";

type LayoutProps = {
  children?: JSX.Element
}


const tabs = [
  { label: () => t("common.chart"), path: "/" },
  { label: () => t("common.timeline"), path: "/timeline" },
  { label: () => t("common.table"), path: "/table" },
  { label: () => t("common.study"), path: "/study" },
]

export function Layout(props: LayoutProps) {
  return (
    <>
      <LanguageSwitcher />
      <HeroSection />
      <main class="mt-8 text-primary-foreground">
        <div class="mb-8">
          <Tabs tabs={tabs} />
        </div>
        {props.children}
      </main>
      <Footer />
    </>
  );
}
