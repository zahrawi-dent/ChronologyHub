import { createSignal } from "solid-js";
import { ToothChart } from "./components/ToothChart";
import { ToothDetails } from "./components/ToothDetails";
import { permanentTeeth, primaryTeeth, type ToothData } from "./data/toothData";
import { Button } from "./components/Button";
import { t } from "./i18n";

export default function ChartTab() {
  const [selectedTooth, setSelectedTooth] = createSignal<ToothData | null>(null);
  const [dentitionType, setDentitionType] = createSignal('permanent');

  const handleDentitionTypeSelect = (type: 'permanent' | 'primary') => {
    setDentitionType(type);
    setSelectedTooth(null);
  }
  return (
    <div class="flex flex-col gap-4">

      {/* Dentition Type Selector */}
      <div class="flex gap-3 justify-center my-2">
        <Button
          class="px-6 py-2 rounded-full font-semibold"
          variant={dentitionType() === 'permanent' ? 'default' : 'outline'}
          onClick={() => handleDentitionTypeSelect('permanent')}
        >
          🦷 {t('referenceTable.permanent')}
        </Button>
        <Button
          class="px-6 py-2 rounded-full font-semibold"
          variant={dentitionType() === 'primary' ? 'default' : 'outline'}
          onClick={() => handleDentitionTypeSelect('primary')}
        >
          🍼 {t('referenceTable.primary')}
        </Button>
      </div>
      {/* <div class="grid lg:grid-cols-3 gap-6"> */}
      <div class="grid xl:grid-cols-3 gap-6">
        {/* <div class="lg:col-span-2"> */}
        <div class="xl:col-span-2">
          <ToothChart
            teeth={dentitionType() === 'permanent' ? permanentTeeth : primaryTeeth}
            onToothSelect={setSelectedTooth}
            selectedTooth={selectedTooth}
            showMixedDentitionIndicator={false}
            showRecentlyErupted={false}
          />
        </div>
        <div>
          <ToothDetails tooth={selectedTooth} />
        </div>
      </div>
    </div>
  )
}
