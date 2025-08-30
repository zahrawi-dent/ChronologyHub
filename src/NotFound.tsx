import { A } from "@solidjs/router";

export default function NotFound() {
  return (
    <div class="flex flex-col items-center justify-center text-center px-4">
      <h1 class="text-6xl font-extrabold text-primary my-4">404</h1>
      <p class="text-xl text-gray-400 mb-8">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <div class="relative w-40 h-40">
        {/* Decorative animated "tooth" vibe */}
        <div class="absolute inset-0 rounded-full border-8 border-primary/30 animate-ping"></div>
        <div class="absolute inset-4 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 blur-xl"></div>
        <div class="relative flex items-center justify-center w-full h-full text-primary text-4xl">
          🦷
        </div>
      </div>
      <A
        noScroll={true}
        href="/"
        class="px-6 py-3 rounded-2xl bg-gradient-to-r from-primary/90 to-primary/70 text-white font-semibold shadow-lg hover:scale-105 transition-transform z-10"
      >
        Go Home
      </A>

    </div>
  );
}
