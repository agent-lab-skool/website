"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronDown,
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CtaButton } from "./cta-button";

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

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const rafRef = useRef<number>(0);
  const draggingRef = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const scheduleHide = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setShowControls(true);
    hideTimerRef.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused && !draggingRef.current) {
        setShowControls(false);
      }
    }, 2500);
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      if (!hasStarted) {
        v.muted = false;
        setMuted(false);
        setHasStarted(true);
      }
      v.play();
      setHasEnded(false);
    } else {
      v.pause();
    }
  }, [hasStarted]);

  const replay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play();
    setHasEnded(false);
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen();
    }
  }, []);

  // Seek to a position based on mouse/pointer X relative to progress bar
  const seekToPosition = useCallback((clientX: number) => {
    const v = videoRef.current;
    const bar = progressRef.current;
    if (!v || !bar || !v.duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    v.currentTime = ratio * v.duration;
    setCurrentTime(v.currentTime);
  }, []);

  // Drag-to-scrub handlers
  const handleScrubStart = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      draggingRef.current = true;
      setIsScrubbing(true);
      seekToPosition(e.clientX);
    },
    [seekToPosition],
  );

  useEffect(() => {
    if (!isScrubbing) return;

    const handleMove = (e: MouseEvent) => {
      seekToPosition(e.clientX);
    };
    const handleUp = () => {
      draggingRef.current = false;
      setIsScrubbing(false);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [isScrubbing, seekToPosition]);

  // Smooth progress updates via requestAnimationFrame
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const tick = () => {
      if (!draggingRef.current && v.currentTime !== undefined) {
        setCurrentTime(v.currentTime);
      }
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
    const onFSChange = () => setIsFullscreen(!!document.fullscreenElement);

    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("loadedmetadata", onDuration);
    v.addEventListener("durationchange", onDuration);
    v.addEventListener("canplay", onDuration);
    v.addEventListener("ended", onEnded);
    document.addEventListener("fullscreenchange", onFSChange);

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
      document.removeEventListener("fullscreenchange", onFSChange);
    };
  }, [scheduleHide]);

  return (
    <div
      ref={containerRef}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black"
      onMouseMove={scheduleHide}
      onMouseLeave={() => playing && !draggingRef.current && setShowControls(false)}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src="/landing/vsl/vsl.mp4"
        className="aspect-video w-full cursor-pointer"
        playsInline
        muted
        preload="auto"
        onClick={togglePlay}
      />

      {/* Blurred thumbnail + play overlay (before first play) */}
      {!hasStarted && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 z-20 flex cursor-pointer items-center justify-center"
        >
          <img
            src="/landing/vsl/thumbnail.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover blur-sm brightness-90"
          />
          <div className="relative flex size-20 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm transition-transform duration-300 hover:scale-105">
            <div className="absolute -inset-2 rounded-full border border-white/[0.08]" />
            <div className="absolute -inset-2 animate-ping rounded-full border border-white/10 [animation-duration:2.5s]" />
            <Play className="ml-1 size-8 fill-white text-white" />
          </div>
        </button>
      )}

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
          showControls && hasStarted && !hasEnded ? "opacity-100" : hasStarted && !hasEnded ? "opacity-0" : "opacity-0",
        )}
      >
        {/* Progress bar */}
        <div
          ref={progressRef}
          className={cn(
            "group/progress relative mb-4 h-1.5 w-full cursor-pointer rounded-full bg-white/20 transition-[height] hover:h-2",
            isScrubbing && "h-2",
          )}
          onMouseDown={handleScrubStart}
        >
          <div
            className="h-full rounded-full bg-white"
            style={{ width: `${progress}%` }}
          >
            <div className={cn(
              "absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-white shadow-sm transition-opacity",
              isScrubbing ? "opacity-100" : "opacity-0 group-hover/progress:opacity-100",
            )} style={{ left: `calc(${progress}% - 8px)` }} />
          </div>
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="cursor-pointer text-white/90 transition-colors hover:text-white"
          >
            {playing ? <Pause className="size-6" /> : <Play className="size-6" />}
          </button>

          <button
            onClick={toggleMute}
            className="cursor-pointer text-white/90 transition-colors hover:text-white"
          >
            {muted ? <VolumeX className="size-6" /> : <Volume2 className="size-6" />}
          </button>

          <span className="text-sm tabular-nums text-white/60">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div className="flex-1" />

          <button
            onClick={toggleFullscreen}
            className="cursor-pointer text-white/90 transition-colors hover:text-white"
          >
            {isFullscreen ? (
              <Minimize className="size-6" />
            ) : (
              <Maximize className="size-6" />
            )}
          </button>
        </div>
      </div>

    </div>
  );
}

export function Hero() {
  const [shuffled] = useState(() => shuffleArray(headlines));
  const [index, setIndex] = useState(0);
  const mountedRef = useRef(false);

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
      <div className="relative z-10 mx-auto max-w-4xl px-6 pt-20 pb-16 sm:pt-32 sm:pb-16">
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

        {/* CTAs */}
        <div className="mt-8 flex flex-row items-start gap-4">
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
      </div>

      {/* Video section */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-16">
        <VideoPlayer />

        {/* Bottom glow under video */}
        <div className="pointer-events-none absolute -bottom-20 left-1/2 h-[200px] w-[60%] -translate-x-1/2 rounded-full bg-white/[0.04] blur-[80px]" />
      </div>
    </section>
  );
}
