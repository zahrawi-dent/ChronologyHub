import { type ToothData } from '../data/toothData';
import { Card, CardContent } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { createSignal, createMemo, For, createEffect } from 'solid-js';
import { getToothsByPosition } from '../utils/toothChart';

interface ToothChartProps {
  teeth: ToothData[];
  onToothSelect?: (tooth: ToothData) => void;
  selectedTooth?: () => ToothData | null;
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

  // Memoize the filtered and sorted teeth
  const maxillaryTeeth = createMemo(() => getToothsByPosition(props.teeth, 'maxillary'));
  const mandibularTeeth = createMemo(() => getToothsByPosition(props.teeth, 'mandibular'));

  const getVariant = (notationType: 'universal' | 'palmer' | 'fdi') => {
    return () => notation() === notationType ? 'default' : 'outline';
  };

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
          Palmer
        </Button>
        <Button
          variant={getVariant('fdi')()}
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
            <h3 class="text-lg font-semibold mb-4">Maxillary (Upper)</h3>
            {/* <div class="flex justify-center gap-1 flex-wrap max-w-4xl mx-auto"> */}
            <div class="relative flex justify-center gap-1 flex-wrap max-w-4xl mx-auto">
              {/* Midline Divider */}
              <div class="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-primary"></div>


              <For each={maxillaryTeeth()}>
                {(tooth) => (
                  <div
                    class={`
                      text-secondary-foreground w-12 h-16 rounded-lg border-2 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center text-xs font-medium shadow-sm
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
                      <Badge variant="secondary" class="text-[6px] px-1 py-0">
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
            <h3 class="text-lg font-semibold mb-4">Mandibular (Lower)</h3>
            {/* <div class="flex justify-center gap-1 flex-wrap max-w-4xl mx-auto"> */}
            <div class="relative flex justify-center gap-1 flex-wrap max-w-4xl mx-auto">

              {/* Midline Divider */}
              <div class="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-primary"></div>

              <For each={mandibularTeeth()}>
                {(tooth) => (
                  <div
                    class={`
                      text-secondary-foreground w-12 h-16 rounded-lg border-2 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center text-xs font-medium shadow-sm
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
                      <Badge variant="secondary" class="text-[6px] px-1 py-0">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};




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
