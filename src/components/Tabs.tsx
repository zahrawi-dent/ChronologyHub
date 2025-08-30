import { A, useLocation } from "@solidjs/router";


type TabsProps = {
  tabs: { label: string; path: string }[];
}
export default function Tabs(props: TabsProps) {
  const location = useLocation();
  const baseUrl = '/chronohub';

  return (
    <div class="bg-background-light/60 backdrop-blur-md border border-gray-700/50 rounded-2xl p-2 shadow-2xl">
      <nav class="flex space-x-1">
        {props.tabs.map((tab) => {
          const isActive = () => location.pathname === baseUrl + tab.path;
          return (
            <A
              noScroll={true}
              href={tab.path}
              class={`relative px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${isActive()
                ? "bg-gradient-to-r from-primary/90 to-primary/60 text-white shadow-lg transform scale-105 tab-glow"
                : "text-gray-300 hover:text-white hover:bg-background-light hover:transform"
                }`}
            >
              {tab.label}
              {isActive() && (
                <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-blue-600/20 animate-pulse"></div>
              )}
            </A>
          );
        })}
      </nav>
    </div>
  );
}
