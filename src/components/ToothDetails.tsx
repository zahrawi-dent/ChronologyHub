import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Badge } from './Badge';
import { Calendar, Clock, Info } from './icons';
import { Show } from 'solid-js';
import type { ToothData } from '../data/toothData';
import { t, getToothName } from '../i18n';

interface ToothDetailsProps {
  tooth: () => ToothData | null;
}

export const ToothDetails = (props: ToothDetailsProps) => {
  const formatAge = (months: number): string => {
    if (months < 12) return `${months} ${t('studyMode.months')}`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) return `${years} ${t('studyMode.years')}`;
    return `${years}${t('studyMode.y')} ${remainingMonths}${t('studyMode.m')}`;
  };

  return (
    <Card class="h-full">
      <Show
        when={props.tooth()}
        fallback={
          <CardContent class="flex items-center justify-center h-full ">
            <div class="text-center">
              <Info class="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t('timeline.noToothSelected')}</p>
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
                {tooth().position === 'maxillary' ? t('studyMode.upper') : t('studyMode.lower')} {getToothName(tooth().nameKey)}
              </CardTitle>
              <div class="flex gap-2 py-2">
                <Badge variant={tooth().type === 'primary' ? 'secondary' : 'default'}>
                  {tooth().type === 'primary' ? t('studyMode.primary') : t('studyMode.permanent')}
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
                  {t('studyMode.notationSystems')}
                </h4>
                <div class="grid grid-cols-3 gap-4">
                   <div class="text-center px-3 bg-secondary rounded-lg">
                     <div class="font-semibold text-lg">{tooth().notation.universal}</div>
                     <div class="text-xs text-muted-foreground">{t('studyMode.universal')}</div>
                   </div>
                   <div class="text-center px-3 bg-secondary rounded-lg">
                     <div class="font-semibold text-lg">{tooth().notation.palmer}</div>
                     <div class="text-xs text-muted-foreground">{t('studyMode.palmer')}</div>
                   </div>
                   <div class="text-center px-3 bg-secondary rounded-lg">
                     <div class="font-semibold text-lg">{tooth().notation.fdi}</div>
                     <div class="text-xs text-muted-foreground">{t('studyMode.fdi')}</div>
                   </div>
                </div>
              </div>

              {/* Eruption Timeline */}
              <div>
                <h4 class="font-semibold mb-3 flex items-center gap-2">
                  <Calendar class="h-4 w-4" />
                  {t('studyMode.eruptionTimeline')}
                </h4>
                <div class="px-4 bg-primary-light rounded-lg">
                  <div class="text-lg font-semibold text-primary">
                    {tooth().eruption.ageRange}
                  </div>
                  <div class="text-sm text-muted-foreground">
                    {t('studyMode.average')}: {formatAge(tooth().eruption.ageMonths)}
                  </div>
                </div>
              </div>

              {/* Crown Completion */}
              <Show when={tooth().rootCompletion}>
                <div>
                  <h4 class="font-semibold mb-3 flex items-center gap-2">
                    <Clock class="h-4 w-4" />
                    {t('referenceTable.crownCompletion')}
                  </h4>
                  <div class="px-4 bg-secondary rounded-lg">
                    <div class="text-lg font-semibold">
                      {tooth().crownCompletion.ageRange}
                    </div>
                    <div class="text-sm text-muted-foreground">
                      {t('studyMode.average')}: {formatAge(tooth().crownCompletion.ageMonths)}
                    </div>
                  </div>
                </div>
              </Show>

              {/* Shedding (Primary teeth only) */}
              <Show when={tooth().shedding}>
                <div>
                  <h4 class="font-semibold mb-3 flex items-center gap-2">
                    <Calendar class="h-4 w-4" />
                    {t('studyMode.sheddingAge')}
                  </h4>
                  <div class="px-4 bg-accent-light rounded-lg">
                    <div class="text-lg font-semibold text-accent">
                      {tooth().shedding!.ageRange}
                    </div>
                    <div class="text-sm text-muted-foreground">
                      {t('studyMode.average')}: {formatAge(tooth().shedding!.ageMonths)}
                    </div>
                  </div>
                </div>
              </Show>

              {/* Root Completion */}
              <Show when={tooth().rootCompletion}>
                <div>
                  <h4 class="font-semibold mb-3 flex items-center gap-2">
                    <Clock class="h-4 w-4" />
                    {t('studyMode.rootCompletion')}
                  </h4>
                  <div class="px-4 bg-secondary rounded-lg">
                    <div class="text-lg font-semibold">
                      {tooth().rootCompletion!.ageRange}
                    </div>
                    <div class="text-sm text-muted-foreground">
                      {t('studyMode.average')}: {formatAge(tooth().rootCompletion!.ageMonths)}
                    </div>
                  </div>
                </div>
              </Show>

              {/* Position Details */}
              {/* <div> */}
              {/*   <h4 class="font-semibold mb-3">Position Details</h4> */}
              {/*   <div class="grid grid-cols-2 gap-4 text-sm"> */}
              {/*     <div> */}
              {/*       <div class="font-medium">Arch</div> */}
              {/*       <div class="text-muted-foreground capitalize"> */}
              {/*         {tooth().position === 'maxillary' ? 'Upper (Maxillary)' : 'Lower (Mandibular)'} */}
              {/*       </div> */}
              {/*     </div> */}
              {/*     <div> */}
              {/*       <div class="font-medium">Side</div> */}
              {/*       <div class="text-muted-foreground capitalize">{tooth().side}</div> */}
              {/*     </div> */}
              {/*   </div> */}
              {/* </div> */}
            </CardContent>
          </>
        )}
      </Show>
    </Card>
  );
};
