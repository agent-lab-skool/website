"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronDown,
  Pause,
  Play,
  RotateCcw,
  Volume2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CtaButton } from "./cta-button";
import { CTA_APPEAR_TIME } from "@/lib/constants/vsl";

const headlines = [
  "a $50K/mo business",
  "your content engine",
  "your own AI tools",
  "an AI employee",
  "your unfair advantage",
  "AI workflows",
  "an AI empire",
  "your sales machine",
];

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function mapProgress(real: number): number {
  const t = Math.max(0, Math.min(1, real));
  return 1 - Math.pow(1 - t, 2); // easeOutQuad
}

function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const rafRef = useRef<number>(0);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [hasStarted, setHasStarted] = useState(true);
  const [hasEnded, setHasEnded] = useState(false);
  const [showUnmuteOverlay, setShowUnmuteOverlay] = useState(true);
  const [showTimedCta, setShowTimedCta] = useState(false);

  const progress = mapProgress(duration > 0 ? currentTime / duration : 0) * 100;

  const scheduleHide = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setShowControls(true);
    hideTimerRef.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) {
        setShowControls(false);
      }
    }, 2500);
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setHasEnded(false);
    } else {
      v.pause();
    }
  }, []);

  const replay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play();
    setHasEnded(false);
    setShowTimedCta(false);
  }, []);

  const handleUnmute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.muted = false;
    setMuted(false);
    setShowUnmuteOverlay(false);
    setShowTimedCta(false);
    v.play();
  }, []);

  // Smooth progress updates via requestAnimationFrame
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const tick = () => {
      setCurrentTime(v.currentTime);
      if (v.duration && isFinite(v.duration)) {
        setDuration(v.duration);
      }
      if (v.currentTime >= CTA_APPEAR_TIME) setShowTimedCta(true);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onPlay = () => {
      setPlaying(true);
      setHasEnded(false);
      scheduleHide();
    };
    const onPause = () => {
      setPlaying(false);
      setShowControls(true);
    };
    const onDuration = () => {
      if (v.duration && isFinite(v.duration)) {
        setDuration(v.duration);
      }
    };
    const onEnded = () => {
      setPlaying(false);
      setHasEnded(true);
      setShowControls(true);
    };
    const onVolumeChange = () => {
      if (!v.muted) {
        setMuted(false);
        setShowUnmuteOverlay(false);
      } else {
        setMuted(true);
      }
    };

    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("loadedmetadata", onDuration);
    v.addEventListener("durationchange", onDuration);
    v.addEventListener("canplay", onDuration);
    v.addEventListener("ended", onEnded);
    v.addEventListener("volumechange", onVolumeChange);

    // If metadata is already loaded (cached video)
    if (v.duration && isFinite(v.duration)) {
      setDuration(v.duration);
    }

    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("loadedmetadata", onDuration);
      v.removeEventListener("durationchange", onDuration);
      v.removeEventListener("canplay", onDuration);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("volumechange", onVolumeChange);
    };
  }, [scheduleHide]);

  return (
    <div
      ref={containerRef}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black"
      onMouseMove={scheduleHide}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src="https://pub-bf33361d545a42aeaa98b0b4ce54cbb1.r2.dev/videos/VSL.mp4"
        className="aspect-video w-full cursor-pointer"
        playsInline
        muted
        autoPlay
        preload="auto"
        onClick={showUnmuteOverlay ? handleUnmute : togglePlay}
      />

      {/* Unmute overlay */}
      <AnimatePresence>
        {showUnmuteOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-10 flex cursor-pointer flex-col items-center justify-center bg-black/60"
            onClick={handleUnmute}
          >
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-white/20" />
              <div className="relative rounded-full bg-white/20 p-5">
                <Volume2 className="size-8 text-white" />
              </div>
            </div>
            <p className="mt-4 text-sm font-medium text-white/80">
              Click to unmute
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Centered pause overlay */}
      <AnimatePresence>
        {!playing && !hasEnded && !showUnmuteOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-[15] flex cursor-pointer items-center justify-center"
            onClick={togglePlay}
          >
            <div className="rounded-full bg-black/50 p-4">
              <Play className="size-10 text-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timed CTA */}
      <AnimatePresence>
        {showTimedCta && playing && !hasEnded && !showUnmuteOverlay && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-x-0 bottom-14 z-20 flex justify-center pointer-events-auto"
          >
            <CtaButton />
          </motion.div>
        )}
      </AnimatePresence>

      {/* End-of-video CTA overlay */}
      <AnimatePresence>
        {hasEnded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-6 bg-black/80 backdrop-blur-sm"
          >
            <p className="max-w-md text-center text-lg font-medium text-white sm:text-xl">
              Ready to build with AI?
            </p>
            <div className="flex items-center gap-3">
              <CtaButton />
              <button
                onClick={replay}
                className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-neutral-800 px-5 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
              >
                <RotateCcw className="size-4" />
                Replay
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom controls */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-5 pb-4 pt-14 transition-opacity duration-300",
          showControls && hasStarted && !hasEnded && !showUnmuteOverlay
            ? "opacity-100"
            : "opacity-0 pointer-events-none",
        )}
      >
        {/* Progress bar (non-interactive) */}
        <div className="h-1 w-full rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white"
            style={{ width: `${progress}%` }}
          />
        </div>

      </div>
    </div>
  );
}

export function Hero() {
  const [shuffled, setShuffled] = useState(headlines);
  const [index, setIndex] = useState(0);
  const mountedRef = useRef(false);

  useEffect(() => {
    setShuffled(shuffleArray(headlines));
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    const interval = setInterval(() => {
      if (mountedRef.current) {
        setIndex((prev) => (prev + 1) % shuffled.length);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [shuffled.length]);

  return (
    <section className="relative">
      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-20 pb-6 sm:pt-32 sm:pb-8">
        {/* Headline */}
        <h1 className="text-4xl leading-[1.12] font-medium tracking-normal text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Build{" "}
          <span className="relative inline-flex align-baseline">
            {/* Hidden sizer, renders longest phrase to hold width */}
            <span className="invisible whitespace-nowrap font-[family-name:var(--font-instrument-serif)] italic">
              your unfair advantage
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(8px)", y: 20 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                exit={{ opacity: 0, filter: "blur(8px)", y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute inset-0 whitespace-nowrap font-[family-name:var(--font-instrument-serif)] italic underline decoration-white/30 underline-offset-[6px]"
              >
                {shuffled[index]}
              </motion.span>
            </AnimatePresence>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-8 max-w-xl text-base leading-relaxed text-neutral-300 sm:text-lg">
          The private AI community for builders who want to move faster, build
          smarter, and stay ahead.
        </p>

      </div>

      {/* Video section */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-16">
        <VideoPlayer />

        {/* CTAs */}
        <div className="mt-8 flex flex-row items-center gap-4">
          <CtaButton />
          <a
            href="#offer"
            className="group/sec inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-neutral-800 px-8 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
          >
            <span className="sm:hidden">See more</span>
            <span className="hidden sm:inline">See what&apos;s inside</span>
            <ChevronDown className="size-4 transition-transform duration-200 group-hover/sec:translate-y-0.5" />
          </a>
        </div>

        {/* Bottom glow under video */}
        <div className="pointer-events-none absolute -bottom-20 left-1/2 h-[200px] w-[60%] -translate-x-1/2 rounded-full bg-white/[0.04] blur-[80px]" />
      </div>
    </section>
  );
}
