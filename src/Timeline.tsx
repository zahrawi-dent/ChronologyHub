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

// Timeline step type for handling multiple events at same time
type TimelineStep = {
  ageMonths: number;
  ageDisplay: string;
  events: TimelineEvent[];
  description: string;
};

export default function Timeline() {
  const [currentStep, setCurrentStep] = createSignal(0);
  const [isAnimating, setIsAnimating] = createSignal(false);
  // const [isAutoPlaying, setIsAutoPlaying] = createSignal(false);
  // const [autoPlaySpeed, setAutoPlaySpeed] = createSignal(1000); // milliseconds
  const [selectedTooth, setSelectedTooth] = createSignal<ToothData | null>(null);
  const [recentlyEruptedTeeth, setRecentlyEruptedTeeth] = createSignal<Set<string>>(new Set());

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
    // primaryTeeth.forEach(tooth => {
    //   // if (tooth.shedding) {
    //   events.push({
    //     id: `shed-${tooth.id}`,
    //     type: 'shedding',
    //     tooth,
    //     ageMonths: tooth.shedding!.ageMonths,
    //     ageDisplay: tooth.shedding!.ageRange,
    //     description: `${tooth.position} ${tooth.side} ${tooth.name} sheds`
    //   });
    //   // }
    // });

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


    return events.sort((a, b) => a.ageMonths - b.ageMonths);
    // // Sort by age (months), then by type (eruption before shedding at same age)
    // return events.sort((a, b) => {
    //   if (a.ageMonths !== b.ageMonths) {
    //     return a.ageMonths - b.ageMonths;
    //   }
    //   // At same age, shedding comes before eruption
    //   if (a.type !== b.type) {
    //     return a.type === 'shedding' ? -1 : 1;
    //   }
    //   return 0;
    // });
  });

  // Group timeline events into steps (handling simultaneous events)
  const timelineSteps = createMemo(() => {
    const events = timelineEvents();
    const steps: TimelineStep[] = [];

    // Add initial state (no teeth)
    steps.push({
      ageMonths: 0,
      ageDisplay: 'Birth',
      events: [],
      description: 'No teeth present yet'
    });

    let currentAge = -1;
    let currentStepEvents: TimelineEvent[] = [];

    events.forEach(event => {
      if (event.ageMonths !== currentAge) {
        // New age group - save previous step if it exists
        if (currentStepEvents.length > 0) {
          const stepDescription = currentStepEvents.length === 1
            ? currentStepEvents[0].description
            : `${currentStepEvents.length} teeth events occur`;

          steps.push({
            ageMonths: currentAge,
            ageDisplay: currentStepEvents[0].ageDisplay,
            events: [...currentStepEvents],
            description: stepDescription
          });
        }

        // Start new age group
        currentAge = event.ageMonths;
        currentStepEvents = [event];
      } else {
        // Same age - add to current group
        currentStepEvents.push(event);
      }
    });

    // Add final step if there are remaining events
    if (currentStepEvents.length > 0) {
      const stepDescription = currentStepEvents.length === 1
        ? currentStepEvents[0].description
        : `${currentStepEvents.length} teeth events occur`;

      steps.push({
        ageMonths: currentAge,
        ageDisplay: currentStepEvents[0].ageDisplay,
        events: [...currentStepEvents],
        description: stepDescription
      });
    }

    return steps;
  });
  // Helper: get the FDI of the primary predecessor for a permanent tooth
  function fdiPredecessorOf(permanent: ToothData): string | null {
    const fdi = permanent.notation?.fdi; // e.g., "14"
    if (!fdi || fdi.length < 2) return null;

    const quadrant = parseInt(fdi[0], 10);
    const pos = parseInt(fdi[1], 10);
    if (Number.isNaN(quadrant) || Number.isNaN(pos)) return null;

    // Only positions 1–5 have primary predecessors (incisors, canines, PREMOLARS)
    if (pos < 1 || pos > 5) return null;

    // Primary quadrants are permanent+4 (1→5, 2→6, 3→7, 4→8)
    const primaryQuadrant = quadrant + 4;
    const primaryPos = pos;

    return `${primaryQuadrant}${primaryPos}`; // e.g., "54" (primary first molar) for "14" (perm first premolar)
  }

  // Get current visible teeth based on timeline step
  const visibleTeeth = createMemo(() => {
    const visible: ToothData[] = [];
    const currentStepIndex = currentStep();

    for (let i = 1; i <= currentStepIndex; i++) {
      const step = timelineSteps()[i];
      if (!step) break;

      step.events.forEach(event => {
        if (event.type !== 'eruption') return;

        // If a permanent with a predecessor erupts, remove that primary (if present)
        if (event.tooth.type === 'permanent') {
          const predFdi = fdiPredecessorOf(event.tooth);
          if (predFdi) {
            const idx = visible.findIndex(
              t => t.type === 'primary' && t.notation?.fdi === predFdi
            );
            if (idx !== -1) {
              visible.splice(idx, 1); // replace primary with permanent
            }
          }
          // If predFdi is null (molars 6–8), do nothing — they don't replace anything
        }

        // Add the erupted tooth (primary or permanent)
        visible.push(event.tooth);
      });
    }

    return visible;
  });

  // Get recently erupted teeth for highlighting
  createEffect(() => {
    const currentStepIndex = currentStep();
    const step = timelineSteps()[currentStepIndex];

    if (step) {
      const newlyEruptedIds = new Set<string>(
        step.events.filter(e => e.type === 'eruption').map(e => e.tooth.id)
      );

      setRecentlyEruptedTeeth(newlyEruptedIds);

      // If this is the final eruption step (third molars)
      if (currentStepIndex === timelineSteps().length - 1 && newlyEruptedIds.size > 0) {
        setTimeout(() => setRecentlyEruptedTeeth(new Set<string>()), 2000);
      }
    } else {
      setRecentlyEruptedTeeth(new Set<string>());
    }
  });

  // Get current age display
  const currentAge = createMemo(() => {
    const step = timelineSteps()[currentStep()];
    return step ? step.ageDisplay : 'Birth';
  });

  // Navigation functions
  const goForward = () => {
    if (currentStep() < timelineSteps().length - 1 && !isAnimating()) {
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
    if (!isAnimating()) {
      setIsAnimating(true);
      setCurrentStep(0);
      setRecentlyEruptedTeeth(new Set<string>());
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const goToEnd = () => {
    if (!isAnimating()) {
      setIsAnimating(true);
      setCurrentStep(timelineSteps().length - 1);
      setRecentlyEruptedTeeth(new Set<string>());
      setTimeout(() => setIsAnimating(false), 500);
    }
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
  // createEffect(() => {
  //   if (isAutoPlaying() && !isComplete()) {
  //     const interval = setInterval(() => {
  //       if (currentStep() < timelineSteps().length - 1) {
  //         goForward();
  //       } else {
  //         setIsAutoPlaying(false);
  //       }
  //     }, autoPlaySpeed());
  //
  //     return () => clearInterval(interval);
  //   }
  // });

  // Add keyboard event listener
  createEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  });

  // Check if timeline is complete
  const isComplete = () => currentStep() === timelineSteps().length - 1;

  // Get current event description
  const currentEventDescription = () => {
    const step = timelineSteps()[currentStep()];
    if (!step) return 'No teeth visible yet';

    // Only count eruption events
    const eruptionEvents = step.events.filter(e => e.type === 'eruption');

    if (isComplete()) return 'Development Complete! All teeth have erupted.';

    if (eruptionEvents.length === 0) {
      return 'No new eruptions at this stage';
    }

    // Check if this is a mixed dentition stage
    const visibleTeethAtStep = visibleTeeth();
    const hasPrimary = visibleTeethAtStep.some(t => t.type === 'primary');
    const hasPermanent = visibleTeethAtStep.some(t => t.type === 'permanent');
    const isMixedStage = hasPrimary && hasPermanent;

    let description = '';
    if (eruptionEvents.length === 1) {
      description = eruptionEvents[0].description;
    } else {
      description = eruptionEvents.length + " teeth erupt"
    }

    // Add mixed dentition indicator
    if (isMixedStage) {
      description += ' (Mixed Dentition Stage)';
    }

    return description;
  };

  return (
    <div class="space-y-8">
      {/* Header */}
      <div class="text-center">
        <h1 class="text-4xl font-bold text-white mb-4">Dental Development Timeline</h1>
        <p class="text-xl text-gray-300">Step through the chronological development of teeth from birth to adulthood</p>
      </div>

      {/* Timeline Controls */}
      <Card class="pt-4">
        <CardContent class="space-y-4">
          {/* Progress Bar */}
          <div class="space-y-2">
            <div class="flex justify-between text-sm text-gray-300">
              <span>Progress</span>
              <span>{currentStep()} / {timelineSteps().length - 1}</span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2">
              <div
                class="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep() / (timelineSteps().length - 1)) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Current Status */}
          <div class="text-center space-y-1">
            <div class="text-2xl font-bold text-white">
              {currentAge()}
            </div>
            <div class="text-lg text-gray-300">
              {currentEventDescription()}
            </div>
            {/* Show multiple events if they occur simultaneously */}
            {/* {timelineSteps()[currentStep()]?.events.some(e => e.type === 'eruption') && ( */}
            {/*   <div class="text-sm text-gray-400"> */}
            {/*     <For each={timelineSteps()[currentStep()].events.filter(e => e.type === 'eruption')}> */}
            {/*       {(event) => ( */}
            {/*         <div>• {event.description}</div> */}
            {/*       )} */}
            {/*     </For> */}
            {/*   </div> */}
            {/* )} */}
          </div>

          {/* Navigation Buttons */}
          <div class="flex justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={resetTimeline}
              disabled={currentStep() === 0}
              class="min-w-[120px]"
            >
              Reset
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={goBackward}
              disabled={currentStep() === 0}
              class="min-w-[120px]"
            >
              ← Previous
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={goForward}
              disabled={isComplete()}
              class="min-w-[120px]"
            >
              Next →
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={goToEnd}
              disabled={isComplete()}
              class="min-w-[120px]"
            >
              End
            </Button>
          </div>

          {/* Auto-play Controls */}
          {/* <div class="flex justify-center items-center gap-4 pt-4 border-t border-gray-700/50"> */}
          {/*   <Button */}
          {/*     variant={isAutoPlaying() ? 'default' : 'outline'} */}
          {/*     size="sm" */}
          {/*     onClick={() => setIsAutoPlaying(!isAutoPlaying())} */}
          {/*     disabled={isComplete()} */}
          {/*     class="min-w-[100px]" */}
          {/*   > */}
          {/*     {isAutoPlaying() ? '⏸️ Pause' : '▶️ Play'} */}
          {/*   </Button> */}
          {/**/}
          {/*   <div class="flex items-center gap-2"> */}
          {/*     <label class="text-sm text-gray-300">Speed:</label> */}
          {/*     <select */}
          {/*       value={autoPlaySpeed()} */}
          {/*       onChange={(e) => setAutoPlaySpeed(Number(e.currentTarget.value))} */}
          {/*       class="bg-gray-700/50 border border-gray-600/50 rounded px-2 py-1 text-white text-sm" */}
          {/*       disabled={isAutoPlaying()} */}
          {/*     > */}
          {/*       <option value={500}>Fast</option> */}
          {/*       <option value={1000}>Normal</option> */}
          {/*       <option value={2000}>Slow</option> */}
          {/*     </select> */}
          {/*   </div> */}
          {/* </div> */}

          {/* Completion Message */}
          {/* {isComplete() && ( */}
          {/*   <div class="text-center p-6 bg-green-500/20 border border-green-500/30 rounded-xl"> */}
          {/*     <div class="text-2xl font-bold text-green-300 mb-2">🎉 Development Complete!</div> */}
          {/*     <div class="text-green-200"> */}
          {/*       All teeth have erupted. The dental development timeline is now complete. */}
          {/*     </div> */}
          {/*   </div> */}
          {/* )} */}

          {/* Keyboard Shortcuts */}
          <div class="text-center text-sm text-gray-400 ">
            <div class="flex justify-center gap-4 flex-wrap">
              <span>← → Arrow keys to navigate</span>
              <span>Space to advance</span>
              <span>Home/End to jump</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tooth Chart and Details */}
      {/* <div class="grid grid-cols-1 lg:grid-cols-3 gap-8"> */}
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Tooth Chart */}
        {/* <div class="lg:col-span-2 space-y-4"> */}
        <div class="xl:col-span-2 space-y-4">
          <h2 class="text-2xl font-bold text-white text-center">Current Dental State</h2>
          <ToothChart
            teeth={visibleTeeth()}
            onToothSelect={setSelectedTooth}
            selectedTooth={() => selectedTooth()}
            recentlyEruptedTeeth={recentlyEruptedTeeth}
            showMixedDentitionIndicator={true}
            showRecentlyErupted={true}
          />

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

      {/* Timeline Steps List */}
      <Card class="p-6">
        <CardContent>
          <h3 class="text-xl font-bold text-white mb-4">Timeline Steps</h3>
          <div class="space-y-2 max-h-96 overflow-y-auto">
            <For each={timelineSteps()}>
              {(step, index) => (
                <div
                  class={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${index() === currentStep()
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-200'
                    : index() < currentStep()
                      ? 'bg-gray-700/30 border-gray-600/50 text-gray-300'
                      : 'bg-gray-800/30 border-gray-700/50 text-gray-500'
                    }`}
                  onClick={() => {
                    if (!isAnimating()) {
                      setIsAnimating(true);
                      setCurrentStep(index());
                      setTimeout(() => setIsAnimating(false), 500);
                    }
                  }}
                >
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-3">
                      <span class="font-medium">{step.ageDisplay}</span>
                      <span>{step.description}</span>
                    </div>
                    <div class="text-xs text-gray-400">
                      Step {index()}
                    </div>
                  </div>
                  {step.events.length > 1 && (
                    <div class="ml-6 space-y-1">
                      <For each={step.events}>
                        {(event) => (
                          <div class="flex items-center gap-2 text-sm">
                            <Badge
                              variant={event.type === 'eruption' ? 'default' : 'secondary'}
                              class="text-xs"
                            >
                              {event.type === 'eruption' ? '🦷' : '📤'}
                            </Badge>
                            <span>{event.description}</span>
                            <span class="text-xs text-gray-400">
                              ({event.tooth.type === 'primary' ? 'Primary' : 'Permanent'})
                            </span>
                          </div>
                        )}
                      </For>
                    </div>
                  )}
                </div>
              )}
            </For>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
