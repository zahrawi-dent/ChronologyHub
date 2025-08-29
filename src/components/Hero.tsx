import { A } from "@solidjs/router";

export default function HeroSection() {
  return (
    <div class="relative ">

      {/* Animated background elements */}
      <div class="absolute inset-0">
        <div class="absolute top-20 left-20 w-72 h-72 bg-background-light rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-20 right-20 w-96 h-96 bg-background-light rounded-full blur-2xl animate-pulse delay-1000"></div>
        {/* <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div> */}
      </div>

      {/* Main content */}
      <div class="relative z-10 text-center pt-10 pb-5 px-6">
        {/* Main heading */}
        <div class="mb-8">
          <h1 class="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            <span class="bg-gradient-to-r from-primary/60 via-primary/80 to-primary bg-clip-text text-transparent">
              Dental Chronology
            </span>
          </h1>
        </div>

        {/* Feature highlights */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <A href="/timeline" class="bg-primary/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-primary/40 transition-all duration-300 hover:transform hover:scale-105">
            <div class="text-3xl mb-3">🦷</div>
            <h3 class="text-lg font-semibold text-white mb-2">Interactive Timeline</h3>
            <p class="text-gray-300 text-sm">Step through dental development milestones with visual feedback</p>
          </A>

          <A href="/table" class="bg-primary/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-primary/40 transition-all duration-300 hover:transform hover:scale-105">
            <div class="text-3xl mb-3">📊</div>
            <h3 class="text-lg font-semibold text-white mb-2">Comprehensive Data</h3>
            <p class="text-gray-300 text-sm">Detailed information on eruption ages, shedding, and development</p>
          </A>

          <A href="/study" class="bg-primary/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-primary/40 transition-all duration-300 hover:transform hover:scale-105">
            <div class="text-3xl mb-3">🎯</div>
            <h3 class="text-lg font-semibold text-white mb-2">Study Mode</h3>
            <p class="text-gray-300 text-sm">Test your knowledge with interactive quizzes and challenges</p>
          </A>
        </div>
      </div>
    </div>
  );
}
