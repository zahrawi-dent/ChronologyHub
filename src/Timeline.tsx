import { createSignal, createMemo, For, createEffect } from 'solid-js';
import { type ToothData, primaryTeeth, permanentTeeth } from './data/toothData';
import { ToothChart } from './components/ToothChart';
import { Button } from './components/Button';
import { Card, CardContent } from './components/Card';
import { Badge } from './components/Badge';
import { ToothDetails } from './components/ToothDetails';

// Timeline event type
type TimelineEvent = {
  id: string;
  type: 'eruption' | 'shedding';
  tooth: ToothData;
  ageMonths: number;
  ageDisplay: string;
  description: string;
};

export default function Timeline() {
  const [currentStep, setCurrentStep] = createSignal(0);
  const [isAnimating, setIsAnimating] = createSignal(false);
  const [isAutoPlaying, setIsAutoPlaying] = createSignal(false);
  const [autoPlaySpeed, setAutoPlaySpeed] = createSignal(1000); // milliseconds
  const [selectedTooth, setSelectedTooth] = createSignal<ToothData | null>(null);

  // Create timeline events from tooth data
  const timelineEvents = createMemo(() => {
    const events: TimelineEvent[] = [];
    
    // Add primary tooth eruptions
    primaryTeeth.forEach(tooth => {
      events.push({
        id: `erupt-${tooth.id}`,
        type: 'eruption',
        tooth,
        ageMonths: tooth.eruption.ageMonths,
        ageDisplay: tooth.eruption.ageRange,
        description: `${tooth.position} ${tooth.side} ${tooth.name} erupts`
      });
    });

    // Add primary tooth shedding
    primaryTeeth.forEach(tooth => {
      if (tooth.shedding) {
        events.push({
          id: `shed-${tooth.id}`,
          type: 'shedding',
          tooth,
          ageMonths: tooth.shedding.ageMonths,
          ageDisplay: tooth.shedding.ageRange,
          description: `${tooth.position} ${tooth.side} ${tooth.name} sheds`
        });
      }
    });

    // Add permanent tooth eruptions
    permanentTeeth.forEach(tooth => {
      events.push({
        id: `erupt-${tooth.id}`,
        type: 'eruption',
        tooth,
        ageMonths: tooth.eruption.ageMonths,
        ageDisplay: tooth.eruption.ageRange,
        description: `${tooth.position} ${tooth.side} ${tooth.name} erupts`
      });
    });

    // Sort by age (months)
    return events.sort((a, b) => a.ageMonths - b.ageMonths);
  });

  // Get current visible teeth based on timeline step
  const visibleTeeth = createMemo(() => {
    const currentEvent = timelineEvents()[currentStep()];
    if (!currentEvent) return [];
    
    const visible: ToothData[] = [];
    
    timelineEvents().slice(0, currentStep() + 1).forEach(event => {
      if (event.type === 'eruption') {
        // Add erupted tooth
        visible.push(event.tooth);
      } else if (event.type === 'shedding') {
        // Remove shed tooth
        const index = visible.findIndex(t => t.id === event.tooth.id);
        if (index !== -1) {
          visible.splice(index, 1);
        }
      }
    });
    
    return visible;
  });

  // Get current age display
  const currentAge = createMemo(() => {
    if (currentStep() === 0) return '0 months';
    const event = timelineEvents()[currentStep() - 1];
    return event ? event.ageDisplay : '0 months';
  });

  // Navigation functions
  const goForward = () => {
    if (currentStep() < timelineEvents().length && !isAnimating()) {
      setIsAnimating(true);
      setCurrentStep(prev => prev + 1);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const goBackward = () => {
    if (currentStep() > 0 && !isAnimating()) {
      setIsAnimating(true);
      setCurrentStep(prev => prev - 1);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const resetTimeline = () => {
    setIsAnimating(true);
    setCurrentStep(0);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToEnd = () => {
    setIsAnimating(true);
    setCurrentStep(timelineEvents().length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Keyboard navigation
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight' || event.key === ' ') {
      event.preventDefault();
      goForward();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goBackward();
    } else if (event.key === 'Home') {
      event.preventDefault();
      resetTimeline();
    } else if (event.key === 'End') {
      event.preventDefault();
      goToEnd();
    }
  };

  // Auto-play functionality
  createEffect(() => {
    if (isAutoPlaying() && !isComplete()) {
      const interval = setInterval(() => {
        if (currentStep() < timelineEvents().length) {
          goForward();
        } else {
          setIsAutoPlaying(false);
        }
      }, autoPlaySpeed());
      
      return () => clearInterval(interval);
    }
  });

  // Add keyboard event listener
  createEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  });

  // Check if timeline is complete
  const isComplete = () => currentStep() === timelineEvents().length;

  // Get current event description
  const currentEventDescription = () => {
    if (currentStep() === 0) return 'No teeth visible yet';
    if (isComplete()) return 'Chronology Complete! All teeth have erupted.';
    
    const event = timelineEvents()[currentStep() - 1];
    return event ? event.description : '';
  };

  return (
    <div class="space-y-8">
      {/* Header */}
      <div class="text-center">
        <h1 class="text-4xl font-bold text-white mb-4">Dental Development Timeline</h1>
        <p class="text-xl text-gray-300">Step through the chronological development of teeth from birth to adulthood</p>
      </div>

      {/* Timeline Controls */}
      <Card class="p-6">
        <CardContent class="space-y-6">
          {/* Progress Bar */}
          <div class="space-y-2">
            <div class="flex justify-between text-sm text-gray-300">
              <span>Progress</span>
              <span>{currentStep()} / {timelineEvents().length}</span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2">
              <div 
                class="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep() / timelineEvents().length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Current Status */}
          <div class="text-center space-y-2">
            <div class="text-2xl font-bold text-white">
              {currentAge()}
            </div>
            <div class="text-lg text-gray-300">
              {currentEventDescription()}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div class="flex justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={resetTimeline}
              disabled={currentStep() === 0 || isAnimating()}
              class="min-w-[120px]"
            >
              Reset
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={goBackward}
              disabled={currentStep() === 0 || isAnimating()}
              class="min-w-[120px]"
            >
              ← Previous
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={goForward}
              disabled={isComplete() || isAnimating()}
              class="min-w-[120px]"
            >
              Next →
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={goToEnd}
              disabled={isComplete() || isAnimating()}
              class="min-w-[120px]"
            >
              End
            </Button>
          </div>

          {/* Auto-play Controls */}
          <div class="flex justify-center items-center gap-4 pt-4 border-t border-gray-700/50">
            <Button
              variant={isAutoPlaying() ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsAutoPlaying(!isAutoPlaying())}
              disabled={isComplete() || isAnimating()}
              class="min-w-[100px]"
            >
              {isAutoPlaying() ? '⏸️ Pause' : '▶️ Play'}
            </Button>
            
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-300">Speed:</label>
              <select
                value={autoPlaySpeed()}
                onChange={(e) => setAutoPlaySpeed(Number(e.currentTarget.value))}
                class="bg-gray-700/50 border border-gray-600/50 rounded px-2 py-1 text-white text-sm"
                disabled={isAutoPlaying()}
              >
                <option value={500}>Fast</option>
                <option value={1000}>Normal</option>
                <option value={2000}>Slow</option>
              </select>
            </div>
          </div>

          {/* Completion Message */}
          {isComplete() && (
            <div class="text-center p-6 bg-green-500/20 border border-green-500/30 rounded-xl">
              <div class="text-2xl font-bold text-green-300 mb-2">🎉 Chronology Complete!</div>
              <div class="text-green-200">
                All teeth have erupted. The dental development timeline is now complete.
              </div>
            </div>
          )}

          {/* Keyboard Shortcuts */}
          <div class="text-center text-sm text-gray-400 pt-2">
            <div class="flex justify-center gap-4 flex-wrap">
              <span>← → Arrow keys to navigate</span>
              <span>Space to advance</span>
              <span>Home/End to jump</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tooth Chart and Details */}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tooth Chart */}
        <div class="lg:col-span-2 space-y-4">
          <h2 class="text-2xl font-bold text-white text-center">Current Dental State</h2>
          <div class={`transition-all duration-500 ${isAnimating() ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
            <ToothChart 
              teeth={visibleTeeth()} 
              onToothSelect={setSelectedTooth}
              selectedTooth={() => selectedTooth()}
            />
          </div>
        </div>

        {/* Tooth Details */}
        <div class="space-y-4">
          <h2 class="text-2xl font-bold text-white text-center">Tooth Details</h2>
          {selectedTooth() ? (
            <ToothDetails tooth={() => selectedTooth()} />
          ) : (
            <Card class="p-6">
              <CardContent class="text-center text-gray-400">
                <div class="text-lg mb-2">No tooth selected</div>
                <div class="text-sm">Click on a tooth in the chart to see its details</div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Timeline Events List */}
      <Card class="p-6">
        <CardContent>
          <h3 class="text-xl font-bold text-white mb-4">Timeline Events</h3>
          <div class="space-y-2 max-h-96 overflow-y-auto">
            <For each={timelineEvents()}>
              {(event, index) => (
                <div 
                  class={`p-3 rounded-lg border transition-all duration-200 ${
                    index() === currentStep() - 1 
                      ? 'bg-blue-500/20 border-blue-500/50 text-blue-200' 
                      : index() < currentStep()
                      ? 'bg-gray-700/30 border-gray-600/50 text-gray-300'
                      : 'bg-gray-800/30 border-gray-700/50 text-gray-500'
                  }`}
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <Badge 
                        variant={event.type === 'eruption' ? 'default' : 'secondary'}
                        class="text-xs"
                      >
                        {event.type === 'eruption' ? '🦷' : '📤'}
                      </Badge>
                      <span class="font-medium">{event.ageDisplay}</span>
                      <span>{event.description}</span>
                    </div>
                    <div class="text-xs text-gray-400">
                      {event.tooth.type === 'primary' ? 'Primary' : 'Permanent'}
                    </div>
                  </div>
                </div>
              )}
            </For>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
