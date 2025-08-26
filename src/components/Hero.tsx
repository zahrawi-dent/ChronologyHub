import { createSignal } from 'solid-js';
import HeroImg from '../assets/dental-chart-hero.jpg';
import { Button } from './Button';
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

// GraduationCap Icon Component
const GraduationCap = (props: { class?: string }) => (
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
    class={props.class || "h-5 w-5"}
  >
    <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
    <path d="M22 10v6" />
    <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
  </svg>
);

// TableProperties Icon Component
const TableProperties = (props: { class?: string }) => (
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
    class={props.class || "h-5 w-5"}
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);

// Badge Component


// Main Hero Component
const HeroSection = () => {
  const [currentTab, setCurrentTab] = createSignal('study');

  // Placeholder image - replace with your actual image

  return (
    <div class="relative overflow-hiddentext-white text-grey-100">
      <div class="relative container mx-auto px-4 py-16">
        <div class="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <div class="flex items-center gap-2 mb-4 text-white">
              <Activity class="h-8 w-8" />
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Dental Education
              </Badge>
            </div>
            <h1 class="text-4xl md:text-5xl font-bold mb-4 text-white">
              Dental Chronology Study App
            </h1>
            <p class="text-xl text-white/90 mb-6">
              Master primary and permanent dentition chronology with interactive charts, study modes, and comprehensive reference tables.
            </p>
            <div class="flex gap-4">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setCurrentTab('study')}
              >
                <GraduationCap class="h-5 w-5 mr-2" />
                Start Studying
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                onClick={() => setCurrentTab('reference')}
              >
                <TableProperties class="h-5 w-5 mr-2" />
                Reference Table
              </Button>
            </div>
          </div>
          <div class="relative">
            <img
              src={HeroImg}
              alt="Dental Chart"
              class="rounded-lg shadow-2xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
