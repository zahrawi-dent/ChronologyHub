import { A, useLocation } from "@solidjs/router";


type TabsProps = {
  tabs: { label: string; path: string }[];
}
export default function Tabs(props: TabsProps) {
  const location = useLocation();

  return (
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-6">
        {props.tabs.map((tab) => {
          const isActive = () => location.pathname === tab.path;

          return (
            <A
              href={tab.path}
              class={`whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors ${isActive()
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-primary-foreground/80 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              {tab.label}
            </A>
          );
        })}
      </nav>
    </div>
  );
}
