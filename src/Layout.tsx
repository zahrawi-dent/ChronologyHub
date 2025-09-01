import { type JSX } from "solid-js";
import HeroSection from "./components/Hero";
import Tabs from "./components/Tabs";
import Footer from "./components/Footer";

type LayoutProps = {
  children?: JSX.Element
}


const tabs = [
  { label: "Chart", path: "/", },
  { label: "Interactive Timeline", path: "/timeline", },
  { label: "Reference Table", path: "/table", },
  { label: "Study Mode", path: "/study", },
]

export function Layout(props: LayoutProps) {
  return (
    <>
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
