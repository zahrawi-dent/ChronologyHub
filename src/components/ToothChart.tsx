import { type ToothData } from '../data/toothData';
import { Card, CardContent } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { createSignal, createMemo, For } from 'solid-js';
import { getToothsByPosition } from '../utils/toothChart';

interface ToothChartProps {
  teeth: ToothData[];
  onToothSelect?: (tooth: ToothData) => void;
  selectedTooth?: () => ToothData | null;
  recentlyEruptedTeeth?: () => Set<string>;
  showMixedDentitionIndicator?: boolean;
  showRecentlyErupted?: boolean;
}

export const ToothChart = (props: ToothChartProps) => {
  const [notation, setNotation] = createSignal<'universal' | 'palmer' | 'fdi'>('universal');

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'incisor': return 'bg-blue-200 border-blue-300 hover:bg-blue-300';
      case 'canine': return 'bg-green-200 border-green-300 hover:bg-green-300';
      case 'premolar': return 'bg-yellow-200 border-yellow-300 hover:bg-yellow-300';
      case 'molar': return 'bg-purple-200 border-purple-300 hover:bg-purple-300';
      default: return 'bg-gray-100 border-gray-300 hover:bg-gray-200';
    }
  };

  // Helper function to get tooth classes with eruption animation
  const getToothClasses = (tooth: ToothData) => {
    const baseClasses = `
      text-secondary-foreground w-12 h-16 rounded-lg border-2 cursor-pointer transition-all duration-500 
      flex flex-col items-center justify-center text-xs font-medium shadow-sm transform
      ${getCategoryColor(tooth.category)}
    `;

    const selectedClasses = props.selectedTooth?.()?.id === tooth.id
      ? 'ring-2 ring-primary ring-offset-2 scale-105 z-10'
      : '';

    const recentlyEruptedClasses = props.showRecentlyErupted && props.recentlyEruptedTeeth?.()?.has(tooth.id)
      ? 'animate-pulse ring-4 ring-yellow-400 ring-opacity-75 shadow-lg shadow-yellow-400/50 scale-110 z-20'
      : '';

    return `${baseClasses} ${selectedClasses} ${recentlyEruptedClasses}`;
  };

  // Memoize the filtered and sorted teeth by position and side
  const maxillaryRightTeeth = createMemo(() =>
    getToothsByPosition(props.teeth, 'maxillary').filter(t => t.side === 'right')
  );

  const maxillaryLeftTeeth = createMemo(() =>
    getToothsByPosition(props.teeth, 'maxillary').filter(t => t.side === 'left')
  );

  const mandibularRightTeeth = createMemo(() =>
    getToothsByPosition(props.teeth, 'mandibular').filter(t => t.side === 'right')
  );

  const mandibularLeftTeeth = createMemo(() =>
    getToothsByPosition(props.teeth, 'mandibular').filter(t => t.side === 'left')
  );

  // Check if we're in mixed dentition
  const isMixedDentition = createMemo(() => {
    if (!props.showMixedDentitionIndicator) return false;
    const hasPrimary = props.teeth.some(t => t.type === 'primary');
    const hasPermanent = props.teeth.some(t => t.type === 'permanent');
    return hasPrimary && hasPermanent;
  });

  const getVariant = (notationType: 'universal' | 'palmer' | 'fdi') => {
    return () => notation() === notationType ? 'default' : 'outline';
  };

  // Helper component for arch display with improved mixed dentition handling
  const ArchDisplay = (tprops: {
    title: string;
    rightTeeth: ToothData[];
    leftTeeth: ToothData[];
    showMidline?: boolean;
    isMaxillary?: boolean;
  }) => (
    <div class="text-center">
      <h3 class="text-lg font-semibold mb-4">{tprops.title}</h3>

      {/* Mixed dentition indicator */}
      {isMixedDentition() && (
        <div class="mb-3">
          <Badge variant="secondary" class="text-xs">
            Mixed Dentition Stage
          </Badge>
        </div>
      )}

      <div class="flex justify-center items-center gap-1 max-w-4xl mx-auto relative">
        {/* Right side teeth */}
        <div class={`flex gap-1 ${tprops.isMaxillary ? 'flex-row-reverse' : ''}`}>
          <For each={tprops.rightTeeth}>
            {(tooth) => (
              <button
                class={getToothClasses(tooth)}
                onClick={() => props.onToothSelect?.(tooth)}
                title={`${tooth.name} - ${tooth.notation[notation()]} (${tooth.type})`}
                style={{
                  'animation-delay': props.showRecentlyErupted && props.recentlyEruptedTeeth?.()?.has(tooth.id) ? '0ms' : undefined
                }}
              >
                <div class="text-[10px] font-bold">
                  {tooth.notation[notation()]}
                </div>
                <div class="text-[8px] text-center leading-tight">
                  {tooth.name.split(' ')[0]}
                </div>
                {tooth.type === 'primary' && (
                  <Badge variant="secondary" class="text-[6px] px-1 py-0">
                    P
                  </Badge>
                )}
                {tooth.type === 'permanent' && (
                  <Badge variant="default" class="text-[6px] px-1 py-0">
                    A
                  </Badge>
                )}
              </button>
            )}
          </For>
        </div>

        {/* Midline - only show if we have teeth on both sides */}
        {(tprops.rightTeeth.length > 0 && tprops.leftTeeth.length > 0) && (
          <div class="w-[3px] h-16 bg-primary/60 rounded-full mx-1 flex-shrink-0"></div>
        )}

        {/* Left side teeth */}
        <div class="flex gap-1">
          <For each={tprops.leftTeeth}>
            {(tooth) => (
              <button
                class={getToothClasses(tooth)}
                onClick={() => props.onToothSelect?.(tooth)}
                title={`${tooth.name} - ${tooth.notation[notation()]} (${tooth.type})`}
                style={{
                  'animation-delay': props.showRecentlyErupted && props.recentlyEruptedTeeth?.()?.has(tooth.id) ? '0ms' : undefined
                }}
              >
                <div class="text-[10px] font-bold">
                  {tooth.notation[notation()]}
                </div>
                <div class="text-[8px] text-center leading-tight">
                  {tooth.name.split(' ')[0]}
                </div>
                {tooth.type === 'primary' && (
                  <Badge variant="secondary" class="text-[6px] px-1 py-0">
                    P
                  </Badge>
                )}
                {tooth.type === 'permanent' && (
                  <Badge variant="default" class="text-[6px] px-1 py-0">
                    A
                  </Badge>
                )}
              </button>
            )}
          </For>
        </div>
      </div>
    </div>
  );

  return (
    <div class="space-y-6">
      <div class="flex gap-2 justify-center mt-4">
        <Button
          variant={getVariant('universal')()}
          size="sm"
          onClick={() => setNotation('universal')}
        >
          Universal
        </Button>
        <Button
          variant={getVariant('palmer')()}
          size="sm"
          onClick={() => setNotation('palmer')}
        >
          FDI
        </Button>
      </div>

      <Card class="p-6">
        <CardContent class="space-y-8">
          {/* Maxillary Arch */}
          <ArchDisplay
            title="Maxillary (Upper)"
            rightTeeth={maxillaryRightTeeth()}
            leftTeeth={maxillaryLeftTeeth()}
            isMaxillary={true}
          />

          {/* Mandibular Arch */}
          <ArchDisplay
            title="Mandibular (Lower)"
            rightTeeth={mandibularRightTeeth()}
            leftTeeth={mandibularLeftTeeth()}
            isMaxillary={false}
          />

          {/* Enhanced Legend */}
          <div class="flex justify-center gap-4 text-xs flex-wrap">
            <div class="flex items-center gap-1">
              <div class="w-4 h-4 rounded bg-blue-200 border border-blue-300"></div>
              <span>Incisors</span>
            </div>
            <div class="flex items-center gap-1">
              <div class="w-4 h-4 rounded bg-green-200 border border-green-300"></div>
              <span>Canines</span>
            </div>
            <div class="flex items-center gap-1">
              <div class="w-4 h-4 rounded bg-yellow-200 border border-yellow-300"></div>
              <span>Premolars</span>
            </div>
            <div class="flex items-center gap-1">
              <div class="w-4 h-4 rounded bg-purple-200 border border-purple-300"></div>
              <span>Molars</span>
            </div>
            {props.showRecentlyErupted && (
              <div class="flex items-center gap-1">
                <div class="w-4 h-4 rounded bg-yellow-400 border border-yellow-500 animate-pulse"></div>
                <span>Recently Erupted</span>
              </div>
            )}
            <div class="flex items-center gap-1">
              <Badge variant="secondary" class="text-xs">P</Badge>
              <span>Primary</span>
            </div>
            <div class="flex items-center gap-1">
              <Badge variant="default" class="text-xs">A</Badge>
              <span>Adult</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <style>{`
        @keyframes erupt-glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(251, 191, 36, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(251, 191, 36, 0.8), 0 0 30px rgba(251, 191, 36, 0.6);
          }
        }
        
        .animate-erupt {
          animation: erupt-glow 2s ease-in-out;
        }
      `}</style>
    </div>
  );
};
