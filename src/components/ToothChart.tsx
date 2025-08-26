import { type ToothData } from '../data/toothData';
import { Card, CardContent } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { createSignal, createMemo, For } from 'solid-js';

interface ToothChartProps {
  teeth: ToothData[];
  onToothSelect?: (tooth: ToothData) => void;
  selectedTooth?: () => ToothData | null;
}

export const ToothChart = (props: ToothChartProps) => {
  const [notation, setNotation] = createSignal<'universal' | 'palmer' | 'fdi'>('universal');

  const getToothsByPosition = (position: 'maxillary' | 'mandibular') => {
    return props.teeth
      .filter(tooth => tooth.position === position)
      .sort((a, b) => {
        if (a.side === 'right' && b.side === 'left') return -1;
        if (a.side === 'left' && b.side === 'right') return 1;
        const categoryOrder = { incisor: 1, canine: 2, premolar: 3, molar: 4 };
        return categoryOrder[a.category] - categoryOrder[b.category];
      });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'incisor': return 'bg-blue-100 border-blue-300 hover:bg-blue-200';
      case 'canine': return 'bg-green-100 border-green-300 hover:bg-green-200';
      case 'premolar': return 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200';
      case 'molar': return 'bg-purple-100 border-purple-300 hover:bg-purple-200';
      default: return 'bg-gray-100 border-gray-300 hover:bg-gray-200';
    }
  };

  // Memoize the filtered teeth so they don't recalculate unnecessarily
  const maxillaryTeeth = createMemo(() => getToothsByPosition('maxillary'));
  const mandibularTeeth = createMemo(() => getToothsByPosition('mandibular'));

  // // Component for individual tooth to reduce repetition
  // const ToothElement = (tprops: { tooth: ToothData }) => (
  //   <div
  //     class={`
  //       w-12 h-16 rounded-lg border-2 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center text-xs font-medium shadow-sm
  //       ${getCategoryColor(tprops.tooth.category)}
  //       ${props.selectedTooth?.()?.id === tprops.tooth.id ? 'ring-2 ring-primary ring-offset-2 scale-105' : ''}
  //     `}
  //     onClick={() => props.onToothSelect?.(tprops.tooth)}
  //     title={`${tprops.tooth.name} - ${tprops.tooth.notation[notation()]}`}
  //   >
  //     <div class="text-[10px] font-bold">
  //       {tprops.tooth.notation[notation()]}
  //     </div>
  //     <div class="text-[8px] text-center leading-tight">
  //       {tprops.tooth.name.split(' ')[0]}
  //     </div>
  //     {tprops.tooth.type === 'primary' && (
  //       <Badge variant="secondary">
  //         P
  //       </Badge>
  //     )}
  //   </div>
  // );

  return (
    <div class="space-y-6">
      <div class="flex gap-2 justify-center">
        <Button
          variant={notation() === 'universal' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setNotation('universal')}
        >
          Universal
        </Button>
        <Button
          variant={notation() === 'palmer' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setNotation('palmer')}
        >
          Palmer
        </Button>
        <Button
          variant={notation() === 'fdi' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setNotation('fdi')}
        >
          FDI
        </Button>
      </div>

      <Card class="p-6">
        <CardContent class="space-y-8">
          {/* Maxillary Arch */}
          <div class="text-center">
            <h3 class="text-lg font-semibold mb-4 text-primary">Maxillary (Upper)</h3>
            <div class="flex justify-center gap-1 flex-wrap max-w-4xl mx-auto">
              <For each={maxillaryTeeth()}>
                {(tooth) => (
                  <div
                    class={`
                      w-12 h-16 rounded-lg border-2 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center text-xs font-medium shadow-sm
                      ${getCategoryColor(tooth.category)}
                      ${props.selectedTooth?.()?.id === tooth.id ? 'ring-2 ring-primary ring-offset-2 scale-105' : ''}
                    `}
                    onClick={() => props.onToothSelect?.(tooth)}
                    title={`${tooth.name} - ${tooth.notation[notation()]}`}
                  >
                    <div class="text-[10px] font-bold">
                      {tooth.notation[notation()]}
                    </div>
                    <div class="text-[8px] text-center leading-tight">
                      {tooth.name.split(' ')[0]}
                    </div>
                    {tooth.type === 'primary' && (
                      <Badge variant="secondary">
                        P
                      </Badge>
                    )}
                  </div>
                )}
              </For>
            </div>
          </div>

          {/* Mandibular Arch */}
          <div class="text-center">
            <h3 class="text-lg font-semibold mb-4 text-primary">Mandibular (Lower)</h3>
            <div class="flex justify-center gap-1 flex-wrap max-w-4xl mx-auto">
              <For each={mandibularTeeth()}>
                {(tooth) => (
                  <div
                    class={`
                      w-12 h-16 rounded-lg border-2 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center text-xs font-medium shadow-sm
                      ${getCategoryColor(tooth.category)}
                      ${props.selectedTooth?.()?.id === tooth.id ? 'ring-2 ring-primary ring-offset-2 scale-105' : ''}
                    `}
                    onClick={() => props.onToothSelect?.(tooth)}
                    title={`${tooth.name} - ${tooth.notation[notation()]}`}
                  >
                    <div class="text-[10px] font-bold">
                      {tooth.notation[notation()]}
                    </div>
                    <div class="text-[8px] text-center leading-tight">
                      {tooth.name.split(' ')[0]}
                    </div>
                    {tooth.type === 'primary' && (
                      <Badge variant="secondary">
                        P
                      </Badge>
                    )}
                  </div>
                )}
              </For>
            </div>
          </div>

          {/* Legend */}
          <div class="flex justify-center gap-4 text-xs">
            <div class="flex items-center gap-1">
              <div class="w-4 h-4 rounded bg-blue-100 border border-blue-300"></div>
              <span>Incisors</span>
            </div>
            <div class="flex items-center gap-1">
              <div class="w-4 h-4 rounded bg-green-100 border border-green-300"></div>
              <span>Canines</span>
            </div>
            <div class="flex items-center gap-1">
              <div class="w-4 h-4 rounded bg-yellow-100 border border-yellow-300"></div>
              <span>Premolars</span>
            </div>
            <div class="flex items-center gap-1">
              <div class="w-4 h-4 rounded bg-purple-100 border border-purple-300"></div>
              <span>Molars</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

