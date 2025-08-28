import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Badge } from './Badge';
import { Calendar, Clock, Info } from './icons';
import { Show } from 'solid-js';
import type { ToothData } from '../data/toothData';

interface ToothDetailsProps {
  tooth: () => ToothData | null;
}

export const ToothDetails = (props: ToothDetailsProps) => {
  const formatAge = (months: number): string => {
    if (months < 12) return `${months} months`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) return `${years} years`;
    return `${years}y ${remainingMonths}m`;
  };

  return (
    <Card class="h-full">
      <Show
        when={props.tooth()}
        fallback={
          <CardContent class="flex items-center justify-center h-full ">
            <div class="text-center">
              <Info class="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a tooth to view details</p>
            </div>
          </CardContent>
        }
      >
        {(tooth) => (
          <>
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <div class={`w-4 h-4 rounded ${tooth().category === 'incisor' ? 'bg-blue-400' :
                  tooth().category === 'canine' ? 'bg-green-400' :
                    tooth().category === 'premolar' ? 'bg-yellow-400' :
                      'bg-purple-400'
                  }`}></div>
                {tooth().position === 'maxillary' ? 'Upper' : 'Lower'} {tooth().name}
              </CardTitle>
              <div class="flex gap-2">
                <Badge variant={tooth().type === 'primary' ? 'secondary' : 'default'}>
                  {tooth().type === 'primary' ? 'Primary' : 'Permanent'}
                </Badge>
                <Badge variant="outline">
                  {tooth().category}
                </Badge>
                <Badge variant="outline">
                  {tooth().side}
                </Badge>
              </div>
            </CardHeader>

            <CardContent class="space-y-6">
              {/* Notation Systems */}
              <div>
                <h4 class="font-semibold mb-3 flex items-center gap-2">
                  <Info class="h-4 w-4" />
                  Notation Systems
                </h4>
                <div class="grid grid-cols-3 gap-4">
                  <div class="text-center p-3 bg-secondary rounded-lg">
                    <div class="font-semibold text-lg">{tooth().notation.universal}</div>
                    <div class="text-xs text-muted-foreground">Universal</div>
                  </div>
                  <div class="text-center p-3 bg-secondary rounded-lg">
                    <div class="font-semibold text-lg">{tooth().notation.palmer}</div>
                    <div class="text-xs text-muted-foreground">Palmer</div>
                  </div>
                  <div class="text-center p-3 bg-secondary rounded-lg">
                    <div class="font-semibold text-lg">{tooth().notation.fdi}</div>
                    <div class="text-xs text-muted-foreground">FDI</div>
                  </div>
                </div>
              </div>

              {/* Eruption Timeline */}
              <div>
                <h4 class="font-semibold mb-3 flex items-center gap-2">
                  <Calendar class="h-4 w-4" />
                  Eruption
                </h4>
                <div class="p-4 bg-primary-light rounded-lg">
                  <div class="text-lg font-semibold text-primary">
                    {tooth().eruption.ageRange}
                  </div>
                  <div class="text-sm text-muted-foreground">
                    Average: {formatAge(tooth().eruption.ageMonths)}
                  </div>
                </div>
              </div>

              {/* Shedding (Primary teeth only) */}
              <Show when={tooth().shedding}>
                <div>
                  <h4 class="font-semibold mb-3 flex items-center gap-2">
                    <Calendar class="h-4 w-4" />
                    Shedding
                  </h4>
                  <div class="p-4 bg-accent-light rounded-lg">
                    <div class="text-lg font-semibold text-accent">
                      {tooth().shedding!.ageRange}
                    </div>
                    <div class="text-sm text-muted-foreground">
                      Average: {formatAge(tooth().shedding!.ageMonths)}
                    </div>
                  </div>
                </div>
              </Show>

              {/* Root Completion */}
              <Show when={tooth().rootCompletion}>
                <div>
                  <h4 class="font-semibold mb-3 flex items-center gap-2">
                    <Clock class="h-4 w-4" />
                    Root Completion
                  </h4>
                  <div class="p-4 bg-secondary rounded-lg">
                    <div class="text-lg font-semibold">
                      {tooth().rootCompletion!.ageRange}
                    </div>
                    <div class="text-sm text-muted-foreground">
                      Average: {formatAge(tooth().rootCompletion!.ageMonths)}
                    </div>
                  </div>
                </div>
              </Show>

              {/* Position Details */}
              <div>
                <h4 class="font-semibold mb-3">Position Details</h4>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div class="font-medium">Arch</div>
                    <div class="text-muted-foreground capitalize">
                      {tooth().position === 'maxillary' ? 'Upper (Maxillary)' : 'Lower (Mandibular)'}
                    </div>
                  </div>
                  <div>
                    <div class="font-medium">Side</div>
                    <div class="text-muted-foreground capitalize">{tooth().side}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </>
        )}
      </Show>
    </Card>
  );
};
