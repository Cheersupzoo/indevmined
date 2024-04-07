"use client";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { useAnimate, useInView, animate } from "framer-motion";
import { useEffect, useRef } from "react";

const words = [
  {
    text: "404",
    className: "text-red-500 dark:text-red-500",
    breakLine: true,
  },
  {
    text: "Page",
  },
  {
    text: "Not",
  },
  {
    text: "Found",
  },
];

export default function Home() {
  const typeWriterEffectRef =
    useRef<React.ElementRef<typeof TypewriterEffect>>(null);
  const highlightRef = useRef<React.ElementRef<typeof Highlight>>(null);

  const mainRef = useRef(null);
  const isInView = useInView(mainRef);
  const [pScope, pAnimate] = useAnimate();

  useEffect(() => {
    const startAnimate = async () => {
      await typeWriterEffectRef.current?.start();
      await animate([
        [
          pScope.current,
          { opacity: 1, transform: "translateY(0px)" },
          { delay: 0.2, duration: 0.7, ease: "easeInOut" },
        ],
        highlightRef.current?.animate()!,
      ]);
    };

    startAnimate();
   
  }, [isInView]);

  return (
    <main ref={mainRef}>
      <HeroHighlight containerClassName="h-screen">
        <div className="flex flex-col items-center justify-center h-full ">
          <div>
            <TypewriterEffect
              ref={typeWriterEffectRef}
              words={words}
              cursorClassName="bg-red-500"
            />
          </div>
          <div className="mt-12 max-w-[80%] h-1 w-full rounded-xl bg-neutral-600 dark:bg-neutral-200" />
          <p
            ref={pScope}
            className="text-neutral-600 dark:text-neutral-200 text-xl mt-6 opacity-0 -translate-y-8"
          >
            IsekaiDev{" "}
            <Highlight
              ref={highlightRef}
              className="font-medium text-neutral-700 dark:text-neutral-300"
            >
              Guide
            </Highlight>
          </p>
        </div>
      </HeroHighlight>
    </main>
  );
}
