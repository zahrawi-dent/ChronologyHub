import { type JSX } from "solid-js";
import HeroSection from "./components/Hero";
import Tabs from "./components/Tabs";

type LayoutProps = {
  children?: JSX.Element
}


const tabs = [
  { label: "Interactive Chart", path: "/", },
  { label: "Timeline", path: "/timeline", },
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
    </>
  );
}
