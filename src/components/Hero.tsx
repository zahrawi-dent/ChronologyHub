import { Badge } from './Badge';

// Activity Icon Component
const Activity = (props: { class?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class={props.class || "h-6 w-6"}
  >
    <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
  </svg>
);


// Badge Component


// Main Hero Component
const HeroSection = () => {

  return (
    <div class="relative overflow-hiddentext-white text-grey-100">
      <div class="relative container mx-auto px-4 py-16">
        <div class="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <div class="flex items-center gap-2 mb-4 text-white">
              <Activity class="h-8 w-8" />
              <Badge variant="secondary" class="bg-white/20 text-white border-white/30">
                Dental Education
              </Badge>
            </div>
            <h1 class="text-4xl md:text-5xl font-bold mb-4 text-white">
              Dental Chronology Study App
            </h1>
            <p class="text-xl text-white/90 mb-6">
              Master primary and permanent dentition chronology with interactive charts, study modes, and comprehensive reference tables.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
