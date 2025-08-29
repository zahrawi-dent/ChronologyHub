import { type JSX } from "solid-js";
import HeroSection from "./components/Hero";
import Tabs from "./components/Tabs";

type LayoutProps = {
  children?: JSX.Element
}


const tabs = [
  {
    label: "Interactive Chart",
    path: "/",
  },
  {
    label: "Timeline",
    path: "/timeline",
  },
  {
    label: "Reference Table",
    path: "/table",
  },
  {
    label: "Study Mode",
    path: "/study",
  },
]

export function Layout(props: LayoutProps) {
  return (
    <>
      <div class="min-h-screen p-20 bg-linear-to-r from-background-darker via-background-dark to-background-light mx-auto">
        <HeroSection />
        <main class="max-w-[100rem]  mt-8 mx-auto min-w-7xl text-primary-foreground">
          <div class="mb-8">
            <Tabs tabs={tabs} />
          </div>
          {props.children}
        </main>
      </div>
    </>
  );
}


