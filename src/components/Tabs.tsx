import { A, useLocation } from "@solidjs/router";
import { isRTL } from "../i18n";

type TabsProps = {
  tabs: { label: string | (() => string); path: string }[];
};

// Configuration
const config = {
  basePath: import.meta.env.VITE_BASE_PATH || '/chronohub',
};

export default function Tabs(props: TabsProps) {
  const location = useLocation();
  const baseURL = config.basePath;


  // helper to normalize trailing slash
  const normalize = (p: string) =>
    p.endsWith("/") && p !== "/" ? p.slice(0, -1) : p;

  return (
    <div class="bg-background-light/60 backdrop-blur-md border border-gray-700/50 rounded-2xl p-2 shadow-2xl">
      <nav class={`flex ${isRTL() ? 'flex-row-reverse space-x-reverse' : 'space-x-1'}`}>
        {props.tabs.map((tab) => {

          const current = normalize(location.pathname);
          const target = normalize(baseURL + tab.path);

          const isActive = current === target;

          return (
            <A
              noScroll={true}
              href={tab.path}
              // The class logic now works correctly based on the isActive function
              class={`relative px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${isActive
                ? "bg-gradient-to-r from-primary/90 to-primary/60 text-white shadow-lg transform scale-105 tab-glow"
                : "text-gray-300 hover:text-white hover:bg-background-light hover:transform"
                }`}
            >
              {typeof tab.label === "function" ? tab.label() : tab.label}
              {/* This conditional rendering also works correctly now */}
              {isActive && (
                <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-blue-600/20 animate-pulse"></div>
              )}
            </A>
          );
        })}
      </nav>
    </div>
  );
}
