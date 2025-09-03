import { createSignal, Show, createMemo, onMount } from "solid-js";
import { permanentTeeth, primaryTeeth, type ToothData } from "./data/toothData";
import { Card, CardContent, CardHeader, CardTitle } from "./components/Card";
import { Button } from "./components/Button";
import { Badge } from "./components/Badge";
import { FaSolidChevronRight, FaSolidTrophy, FaSolidBookOpen, FaSolidBrain, FaSolidCheck } from 'solid-icons/fa'
import { FiTarget, FiSkipForward, FiSettings, FiZap, FiBarChart, FiRotateCcw } from 'solid-icons/fi'
import { BiRegularTimer } from 'solid-icons/bi'
import { VsChromeClose } from 'solid-icons/vs'
import { Progress } from "./components/Progress";
import { t, getToothName } from "./i18n";

type StudyModeType = "eruption" | "notation" | "mixed";
type StudySession = {
  id: string;
  correctAnswers: number;
  totalQuestions: number;
  studyType: StudyModeType;
};

type SavedSession = {
  currentIndex: number;
  showAnswer: boolean;
  studyType: StudyModeType;
  shuffledTeeth: ToothData[];
  correctAnswers: number;
  totalAnswered: number;
  isSessionActive: boolean;
};

type SavedStats = {
  bestScore: number;
  studyHistory: StudySession[];
};

// localStorage keys
const SESSION_KEY = 'studyMode_session';
const STATS_KEY = 'studyMode_stats';

// localStorage utility functions
const saveSession = (session: SavedSession) => {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.warn('Failed to save session to localStorage:', error);
  }
};

const loadSession = (): SavedSession | null => {
  try {
    const saved = localStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.warn('Failed to load session from localStorage:', error);
    return null;
  }
};

const saveStats = (stats: SavedStats) => {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.warn('Failed to save stats to localStorage:', error);
  }
};

const loadStats = (): SavedStats | null => {
  try {
    const saved = localStorage.getItem(STATS_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.warn('Failed to load stats from localStorage:', error);
    return null;
  }
};

export default function StudyMode() {
  // Core state
  const [currentIndex, setCurrentIndex] = createSignal(0);
  const [showAnswer, setShowAnswer] = createSignal(false);
  const [studyType, setStudyType] = createSignal<StudyModeType>("eruption");
  const [shuffledTeeth, setShuffledTeeth] = createSignal<ToothData[]>([]);
  const [correctAnswers, setCorrectAnswers] = createSignal(0);
  const [totalAnswered, setTotalAnswered] = createSignal(0);
  const [isSessionActive, setIsSessionActive] = createSignal(false);
  const [showStats, setShowStats] = createSignal(false);
  const [bestScore, setBestScore] = createSignal(0);
  const [studyHistory, setStudyHistory] = createSignal<StudySession[]>([]);

  // Computed values
  const currentTooth = createMemo(() => shuffledTeeth()[currentIndex()]);
  const progress = createMemo(() => ((currentIndex() + 1) / shuffledTeeth().length) * 100);
  const accuracy = createMemo(() => totalAnswered() > 0 ? (correctAnswers() / totalAnswered()) * 100 : 0);

  const teeth = [primaryTeeth, permanentTeeth].flat();

  // Save current session to localStorage
  const saveCurrentSession = () => {
    if (isSessionActive()) {
      const session: SavedSession = {
        currentIndex: currentIndex(),
        showAnswer: showAnswer(),
        studyType: studyType(),
        shuffledTeeth: shuffledTeeth(),
        correctAnswers: correctAnswers(),
        totalAnswered: totalAnswered(),
        isSessionActive: true,
      };
      saveSession(session);
    }
  };

  // Initialize session
  const startNewSession = () => {
    const shuffled = teeth.sort(() => Math.random() - 0.5);
    setShuffledTeeth(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
    setCorrectAnswers(0);
    setTotalAnswered(0);
    setIsSessionActive(true);
    setShowStats(false);

    // Save new session to localStorage
    const session: SavedSession = {
      currentIndex: 0,
      showAnswer: false,
      studyType: studyType(),
      shuffledTeeth: shuffled,
      correctAnswers: 0,
      totalAnswered: 0,
      isSessionActive: true,
    };
    saveSession(session);
  };

  // End session and save stats
  const endSession = () => {
    const session: StudySession = {
      id: Date.now().toString(),
      correctAnswers: correctAnswers(),
      totalQuestions: totalAnswered(),
      studyType: studyType(),
    };

    setStudyHistory(prev => [session, ...prev.slice(0, 9)]); // Keep last 10 sessions

    if (accuracy() > bestScore()) {
      setBestScore(accuracy());
    }

    setIsSessionActive(false);

    // Save stats to localStorage
    const stats: SavedStats = {
      bestScore: bestScore(),
      studyHistory: studyHistory(),
    };
    saveStats(stats);

    // Clear session from localStorage
    localStorage.removeItem(SESSION_KEY);
  };

  // Navigation
  const nextCard = () => {
    if (currentIndex() < shuffledTeeth().length - 1) {
      setCurrentIndex(currentIndex() + 1);
      setShowAnswer(false);
      saveCurrentSession();
    } else {
      endSession();
    }
  };

  const previousCard = () => {
    if (currentIndex() > 0) {
      setCurrentIndex(currentIndex() - 1);
      setShowAnswer(false);
      saveCurrentSession();
    }
  };

  // Answer handling
  const markCorrect = () => {
    if (!showAnswer()) {
      setCorrectAnswers(prev => prev + 1);
      setTotalAnswered(prev => prev + 1);
      setShowAnswer(true);
      saveCurrentSession();
    }
  };

  const markIncorrect = () => {
    if (!showAnswer()) {
      setTotalAnswered(prev => prev + 1);
      setShowAnswer(true);
      saveCurrentSession();
    }
  };

  const skipCard = () => {
    setTotalAnswered(prev => prev + 1);
    setShowAnswer(true);
    saveCurrentSession();
  };

  // Utility functions
  const formatAge = (months: number): string => {
    if (months < 12) return `${months} months`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) return `${years} years`;
    return `${years}y ${remainingMonths}m`;
  };


  // Initialize on mount
  onMount(() => {
    // Load saved stats
    const savedStats = loadStats();
    if (savedStats) {
      setBestScore(savedStats.bestScore);
      setStudyHistory(savedStats.studyHistory);
    }

    // Load saved session
    const savedSession = loadSession();
    if (savedSession) {
      setCurrentIndex(savedSession.currentIndex);
      setShowAnswer(savedSession.showAnswer);
      setStudyType(savedSession.studyType);
      setShuffledTeeth(savedSession.shuffledTeeth);
      setCorrectAnswers(savedSession.correctAnswers);
      setTotalAnswered(savedSession.totalAnswered);
      setIsSessionActive(savedSession.isSessionActive);
    } else {
      startNewSession();
    }
  });


  return (
    <div class="max-w-4xl mx-auto space-y-6 p-4">
      {/* Header with Stats */}
      <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <FaSolidBookOpen class="h-6 w-6 text-primary" />
              <h1 class="text-2xl font-bold">{t('studyMode.title')}</h1>
            </div>
          </div>

        <div class="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowStats(!showStats())}
            class="flex items-center gap-2"
          >
            <FiBarChart class="h-4 w-4" />
            {t('studyMode.stats')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={startNewSession}
            class="flex items-center gap-2"
          >
            <FiRotateCcw class="h-4 w-4" />
            {t('studyMode.newSession')}
          </Button>
        </div>
      </div>

      {/* Stats Panel */}
      <Show when={showStats()}>
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <FiBarChart class="h-5 w-5" />
              {t('studyMode.studyStatistics')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-primary">{bestScore().toFixed(1)}%</div>
                <div class="text-sm text-muted-foreground">{t('studyMode.bestScore')}</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">{studyHistory().length}</div>
                <div class="text-sm text-muted-foreground">{t('studyMode.sessions')}</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-purple-600">
                  {studyHistory().reduce((acc, session) => acc + session.totalQuestions, 0)}
                </div>
                <div class="text-sm text-muted-foreground">{t('studyMode.questions')}</div>
              </div>
            </div>

            <Show when={studyHistory().length > 0}>
              <div class="mt-4 pt-4 border-t">
                <h4 class="font-semibold mb-2">{t('studyMode.recentSessions')}</h4>
                <div class="space-y-2 max-h-40 overflow-y-auto">
                  {studyHistory().map(session => (
                    <div class="flex justify-between items-center p-2 bg-muted rounded">
                      <div class="flex items-center gap-2">
                        <Badge variant="outline" class="text-xs">
                          {session.studyType}
                        </Badge>
                      </div>
                      <div class="text-sm">
                        {session.correctAnswers}/{session.totalQuestions} ({((session.correctAnswers / session.totalQuestions) * 100).toFixed(1)}%)
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Show>
          </CardContent>
        </Card>
      </Show>

      {/* Study Configuration */}
      <Card>
        <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <FiSettings class="h-5 w-5" />
              {t('studyMode.studyConfiguration')}
            </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          {/* Study Type Selector */}
          <div>
            <label class="text-sm font-medium mb-2 block">{t('studyMode.studyFocus')}</label>
            <div class="flex flex-wrap gap-2">
              {[
                { key: "eruption", label: t('studyMode.eruptionAges'), icon: BiRegularTimer, desc: t('studyMode.eruptionAgesDesc') },
                { key: "notation", label: t('studyMode.toothNotation'), icon: FiTarget, desc: t('studyMode.toothNotationDesc') },
                { key: "mixed", label: t('studyMode.mixedReview'), icon: FaSolidBrain, desc: t('studyMode.mixedReviewDesc') },
              ].map(({ key, label, icon: Icon }) => (
                 <Button
                   variant={studyType() === key ? "default" : "outline"}
                   size="sm"
                   onClick={() => {
                     setStudyType(key as StudyModeType);
                     saveCurrentSession();
                   }}
                   class="flex items-center gap-2 min-w-[140px] justify-start"
                 >
                  <Icon class="h-4 w-4" />
                  {label}
                </Button>
              ))}
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Main Study Interface */}
      <Show when={isSessionActive() && currentIndex() < shuffledTeeth().length} fallback={
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2 text-center w-full justify-center">
              <FaSolidTrophy class="h-8 w-8 text-yellow-500" />
              {t('studyMode.studySessionComplete')}
            </CardTitle>
          </CardHeader>
          <CardContent class="text-center space-y-6">
            <div class="space-y-4">
              <div class="text-6xl font-bold text-primary">
                {accuracy().toFixed(1)}%
              </div>
              <div class="text-xl text-muted-foreground">
                {t('studyMode.youGotCorrect', { correct: correctAnswers(), total: totalAnswered() })}
              </div>
            </div>

            <div class="flex gap-4 justify-center">
              <Button onClick={startNewSession} variant="default" size="lg" class="flex items-center gap-2">
                <FiZap class="h-5 w-5" />
                {t('studyMode.startNewSession')}
              </Button>
              <Button onClick={() => setShowStats(true)} variant="outline" size="lg" class="flex items-center gap-2">
                <FiBarChart class="h-5 w-5" />
                {t('studyMode.viewStats')}
              </Button>
            </div>
          </CardContent>
        </Card>
      }>
        {/* Progress Bar */}
        <div class="space-y-3">
          <div class="flex justify-between text-sm">
            <div class="flex items-center gap-4">
              <span class="font-medium">
                {t('studyMode.cardOf', { current: currentIndex() + 1, total: shuffledTeeth().length })}
              </span>
              <span class="text-muted-foreground">
                {correctAnswers()}/{totalAnswered()} {t('studyMode.correct')} ({accuracy().toFixed(1)}%)
              </span>
            </div>
          </div>
          <Progress value={progress()} class="h-3" />
        </div>

        {/* Flashcard */}
        <Card class="min-h-[500px]">
          <CardHeader>
            <div class="flex justify-between items-start">
              <div class="space-y-2">
                <CardTitle class="text-2xl flex items-center gap-2">
                  <span class="text-primary"
                  > {currentTooth()?.type === "primary" ? t('studyMode.primary') : t('studyMode.permanent')} </span>
                  <span>
                    {currentTooth()?.position === "maxillary" ? t('studyMode.upper') : t('studyMode.lower')}
                  </span>
                   <span>{currentTooth() ? getToothName(currentTooth()!.nameKey) : ''}</span>
                </CardTitle>
                <div class="flex gap-2">
                  <Badge variant="outline">
                    {currentTooth()?.side}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent class="space-y-8">
            {/* Question Section */}
            <div class="text-center space-y-4">
              <Show when={studyType() === "eruption"}>
                <div>
                  <h3 class="text-xl font-semibold mb-3">
                    {t('studyMode.whenDoesToothErupt')}
                  </h3>
                  <Show when={currentTooth()?.type === "primary"}>
                    <p class="text-muted-foreground">
                      {t('studyMode.alsoWhenDoesShed')}
                    </p>
                  </Show>
                </div>
              </Show>

              <Show when={studyType() === "notation"}>
                <div>
                  <h3 class="text-xl font-semibold mb-3">
                    {t('studyMode.whatAreNotationNumbers')}
                  </h3>
                  <p class="text-muted-foreground">
                    {t('studyMode.universalPalmerFdi')}
                  </p>
                </div>
              </Show>

              <Show when={studyType() === "mixed"}>
                <div>
                  <h3 class="text-xl font-semibold mb-3">
                    {t('studyMode.whatDoYouKnow')}
                  </h3>
                  <p class="text-muted-foreground">
                    {t('studyMode.eruptionNotationCharacteristics')}
                  </p>
                </div>
              </Show>
            </div>

            {/* Answer Section */}
            <Show when={showAnswer()}>
              <div class="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-xl space-y-6 border border-primary/20">
                <Show when={studyType() !== "notation"}>
                  <div class="space-y-3">
                    <h4 class="font-semibold text-lg flex items-center gap-2">
                      <BiRegularTimer class="h-5 w-5 text-primary" />
                      {t('studyMode.eruptionTimeline')}
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="bg-background p-3 rounded-lg">
                        <div class="font-medium text-sm text-muted-foreground">{t('studyMode.eruptionAge')}</div>
                        <div class="text-lg font-semibold">
                          {currentTooth()?.eruption.ageRange}
                        </div>
                        <div class="text-sm text-muted-foreground">
                          {t('studyMode.average')} {formatAge(currentTooth()?.eruption.ageMonths ?? 0)}
                        </div>
                      </div>

                      <Show when={currentTooth()?.shedding}>
                        <div class="bg-background p-3 rounded-lg">
                          <div class="font-medium text-sm text-muted-foreground">{t('studyMode.sheddingAge')}</div>
                          <div class="text-lg font-semibold">
                            {currentTooth()?.shedding?.ageRange}
                          </div>
                          <div class="text-sm text-muted-foreground">
                            Average: {formatAge(currentTooth()?.shedding?.ageMonths ?? 0)}
                          </div>
                        </div>
                      </Show>

                      <Show when={currentTooth()?.rootCompletion}>
                        <div class="bg-background p-3 rounded-lg">
                          <div class="font-medium text-sm text-muted-foreground">{t('studyMode.rootCompletion')}</div>
                          <div class="text-lg font-semibold">
                            {currentTooth()?.rootCompletion?.ageRange}
                          </div>
                          <div class="text-sm text-muted-foreground">
                            Average: {formatAge(currentTooth()?.rootCompletion?.ageMonths ?? 0)}
                          </div>
                        </div>
                      </Show>
                    </div>
                  </div>
                </Show>

                <Show when={studyType() !== "eruption"}>
                  <div class="space-y-3">
                    <h4 class="font-semibold text-lg flex items-center gap-2">
                      <FiTarget class="h-5 w-5 text-primary" />
                      {t('studyMode.notationSystems')}
                    </h4>
                    <div class="grid grid-cols-3 gap-3">
                      <div class="bg-background p-4 rounded-lg text-center border border-border">
                        <div class="text-2xl font-bold text-primary mb-1">
                          {currentTooth()?.notation.universal}
                        </div>
                        <div class="text-xs text-muted-foreground uppercase tracking-wide">{t('studyMode.universal')}</div>
                      </div>
                      <div class="bg-background p-4 rounded-lg text-center border border-border">
                        <div class="text-2xl font-bold text-primary mb-1">
                          {currentTooth()?.notation.palmer}
                        </div>
                        <div class="text-xs text-muted-foreground uppercase tracking-wide">{t('studyMode.palmer')}</div>
                      </div>
                      <div class="bg-background p-4 rounded-lg text-center border border-border">
                        <div class="text-2xl font-bold text-primary mb-1">
                          {currentTooth()?.notation.fdi}
                        </div>
                        <div class="text-xs text-muted-foreground uppercase tracking-wide">{t('studyMode.fdi')}</div>
                      </div>
                    </div>
                  </div>
                </Show>
              </div>
            </Show>

            {/* Action Buttons */}
            <div class="space-y-4">
              <Show when={!showAnswer()} fallback={
                <div class="flex gap-3 justify-center">
                  <Button onClick={previousCard} variant="outline" disabled={currentIndex() === 0} class="flex-1">
                    {t('studyMode.previous')}
                  </Button>
                  <Button onClick={nextCard} variant="default" class="flex-1 flex items-center gap-2">
                    {t('studyMode.nextCard')}
                    <FaSolidChevronRight class="h-4 w-4" />
                  </Button>
                </div>
              }>
                <div class="grid grid-cols-3 gap-3">
                  <Button onClick={markIncorrect} variant="outline" class="flex items-center gap-2">
                    <VsChromeClose class="h-4 w-4" />
                    {t('studyMode.dontKnow')}
                  </Button>
                  <Button onClick={skipCard} variant="outline" class="flex items-center gap-2">
                    <FiSkipForward class="h-4 w-4" />
                    {t('studyMode.skip')}
                  </Button>
                  <Button onClick={markCorrect} variant="default" class="flex items-center gap-2">
                    <FaSolidCheck class="h-4 w-4" />
                    {t('studyMode.iKnowThis')}
                  </Button>
                </div>
              </Show>
            </div>
          </CardContent>
        </Card>
      </Show>
    </div>
  );
}
