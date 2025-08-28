import { createSignal, createEffect, Show } from "solid-js";
import { permanentTeeth, primaryTeeth, type ToothData } from "./data/toothData";
import { Card, CardContent, CardHeader, CardTitle } from "./components/Card";
import { Button } from "./components/Button";
import { Badge } from "./components/Badge";
import { RotateCcw, ChevronRight, Trophy } from "lucide-solid";
import { Progress } from "./components/Progress";

// interface StudyModeProps {
//   teeth: ToothData[];
// }


export default function StudyMode() {
  const teeth = [primaryTeeth, permanentTeeth].flat()
  const [currentIndex, setCurrentIndex] = createSignal(0);
  const [showAnswer, setShowAnswer] = createSignal(false);
  const [studyType, setStudyType] = createSignal<
    "eruption" | "notation" | "mixed"
  >("eruption");
  const [shuffledTeeth, setShuffledTeeth] = createSignal<ToothData[]>([]);
  const [correctAnswers, setCorrectAnswers] = createSignal(0);
  const [totalAnswered, setTotalAnswered] = createSignal(0);

  const shuffleTeeth = () => {
    const shuffled = teeth.sort(() => Math.random() - 0.5);
    setShuffledTeeth(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
    setCorrectAnswers(0);
    setTotalAnswered(0);
  };

  createEffect(() => {
    shuffleTeeth();
  });

  const currentTooth = () => shuffledTeeth()[currentIndex()];
  const progress = () =>
    ((currentIndex() + 1) / shuffledTeeth().length) * 100;

  const nextCard = () => {
    if (currentIndex() < shuffledTeeth().length - 1) {
      setCurrentIndex(currentIndex() + 1);
      setShowAnswer(false);
    }
  };

  const markCorrect = () => {
    if (!showAnswer()) {
      setCorrectAnswers(correctAnswers() + 1);
      setTotalAnswered(totalAnswered() + 1);
      setShowAnswer(true);
    }
  };

  const markIncorrect = () => {
    if (!showAnswer()) {
      setTotalAnswered(totalAnswered() + 1);
      setShowAnswer(true);
    }
  };

  const formatAge = (months: number): string => {
    if (months < 12) return `${months} months`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) return `${years} years`;
    return `${years}y ${remainingMonths}m`;
  };

  return (
    <div class="space-y-4">
      <Show when={currentIndex() < shuffledTeeth().length} fallback={
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Trophy class="h-5 w-5 text-yellow-500" />
              Study Session Complete!
            </CardTitle>
          </CardHeader>
          <CardContent class="text-center space-y-4">
            <div class="text-3xl font-bold text-primary">
              {totalAnswered() > 0
                ? Math.round((correctAnswers() / totalAnswered()) * 100)
                : 0}
              %
            </div>
            <p class="text-muted-foreground">
              You got {correctAnswers()} out of {totalAnswered()} correct
            </p>
            <Button onClick={shuffleTeeth} variant="medical" class="w-full">
              <RotateCcw class="h-4 w-4 mr-2" />
              Start New Session
            </Button>
          </CardContent>
        </Card>
      }>
        {/* Study Type Selector */}
        <div class="flex gap-2 justify-center">
          <Button
            variant={studyType() === "eruption" ? "default" : "outline"}
            size="sm"
            onClick={() => setStudyType("eruption")}
          >
            Eruption Ages
          </Button>
          <Button
            variant={studyType() === "notation" ? "default" : "outline"}
            size="sm"
            onClick={() => setStudyType("notation")}
          >
            Tooth Notation
          </Button>
          <Button
            variant={studyType() === "mixed" ? "default" : "outline"}
            size="sm"
            onClick={() => setStudyType("mixed")}
          >
            Mixed Review
          </Button>
        </div>

        {/* Progress */}
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span>
              Card {currentIndex() + 1} of {shuffledTeeth().length}
            </span>
            <span>
              {correctAnswers()}/{totalAnswered()} correct
            </span>
          </div>
          <Progress value={progress()} class="h-2" />
        </div>

        {/* Flashcard */}
        <Card class="min-h-[400px]">
          <CardHeader>
            <div class="flex justify-between items-start">
              <div>
                <CardTitle class="text-xl">
                  {currentTooth()?.position === "maxillary" ? "Upper" : "Lower"}{" "}
                  {currentTooth()?.name}
                </CardTitle>
                <div class="flex gap-2 mt-2">
                  <Badge
                    variant={
                      currentTooth()?.type === "primary"
                        ? "secondary"
                        : "default"
                    }
                  >
                    {currentTooth()?.type === "primary"
                      ? "Primary"
                      : "Permanent"}
                  </Badge>
                  <Badge variant="outline" class="capitalize">
                    {currentTooth()?.category}
                  </Badge>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={shuffleTeeth}>
                <RotateCcw class="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent class="space-y-6">
            {/* Question */}
            <div class="text-center">
              <Show when={studyType() === "eruption"}>
                <div>
                  <h3 class="text-lg font-semibold mb-2">
                    When does this tooth typically erupt?
                  </h3>
                  <Show when={currentTooth()?.type === "primary"}>
                    <p class="text-sm text-muted-foreground">
                      Also, when does it typically shed?
                    </p>
                  </Show>
                </div>
              </Show>
              <Show when={studyType() === "notation"}>
                <div>
                  <h3 class="text-lg font-semibold mb-2">
                    What are the notation numbers for this tooth?
                  </h3>
                  <p class="text-sm text-muted-foreground">
                    Universal, Palmer, and FDI systems
                  </p>
                </div>
              </Show>
              <Show when={studyType() === "mixed"}>
                <div>
                  <h3 class="text-lg font-semibold mb-2">
                    What do you know about this tooth?
                  </h3>
                  <p class="text-sm text-muted-foreground">
                    Eruption age, notation, and characteristics
                  </p>
                </div>
              </Show>
            </div>

            {/* Answer */}
            <Show when={showAnswer()}>
              <div class="bg-primary-light p-4 rounded-lg space-y-4">
                <Show when={studyType() !== "notation"}>
                  <div>
                    <h4 class="font-semibold">Eruption Age</h4>
                    <p>
                      {currentTooth()?.eruption.ageRange} (avg:{" "}
                      {formatAge(currentTooth()?.eruption.ageMonths ?? 0)})
                    </p>
                    <Show when={currentTooth()?.shedding}>
                      <div class="mt-2">
                        <h4 class="font-semibold">Shedding Age</h4>
                        <p>
                          {currentTooth()?.shedding?.ageRange} (avg:{" "}
                          {formatAge(currentTooth()?.shedding?.ageMonths ?? 0)})
                        </p>
                      </div>
                    </Show>
                    <Show when={currentTooth()?.rootCompletion}>
                      <div class="mt-2">
                        <h4 class="font-semibold">Root Completion</h4>
                        <p>
                          {currentTooth()?.rootCompletion?.ageRange} (avg:{" "}
                          {formatAge(
                            currentTooth()?.rootCompletion?.ageMonths ?? 0
                          )}
                          )
                        </p>
                      </div>
                    </Show>
                  </div>
                </Show>

                <Show when={studyType() !== "eruption"}>
                  <div>
                    <h4 class="font-semibold mb-2">Notation Systems</h4>
                    <div class="grid grid-cols-3 gap-2">
                      <div class="text-center p-2 bg-background rounded">
                        <div class="font-bold">
                          {currentTooth()?.notation.universal}
                        </div>
                        <div class="text-xs">Universal</div>
                      </div>
                      <div class="text-center p-2 bg-background rounded">
                        <div class="font-bold">
                          {currentTooth()?.notation.palmer}
                        </div>
                        <div class="text-xs">Palmer</div>
                      </div>
                      <div class="text-center p-2 bg-background rounded">
                        <div class="font-bold">
                          {currentTooth()?.notation.fdi}
                        </div>
                        <div class="text-xs">FDI</div>
                      </div>
                    </div>
                  </div>
                </Show>
              </div>
            </Show>

            {/* Action Buttons */}
            <div class="flex gap-2 justify-center">
              <Show when={!showAnswer()} fallback={
                <Button onClick={nextCard} variant="medical" class="flex-1">
                  Next Card
                  <ChevronRight class="h-4 w-4 ml-2" />
                </Button>
              }>
                <>
                  <Button onClick={markIncorrect} variant="outline" class="flex-1">
                    Show Answer
                  </Button>
                  <Button onClick={markCorrect} variant="study" class="flex-1">
                    I Know This!
                  </Button>
                </>
              </Show>
            </div>
          </CardContent>
        </Card>
      </Show>
    </div>
  );
}
