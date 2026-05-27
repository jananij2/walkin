"use client";

import { useEffect, useRef, useState } from "react";

export function ClosetDoor() {
  const [isOpen, setIsOpen] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsOpen(true));
    return () => {
      cancelAnimationFrame(frame);
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  function handleToggle() {
    setIsOpen((current) => {
      const next = !current;

      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }

      if (next) {
        scrollTimeoutRef.current = window.setTimeout(() => {
          document.getElementById("walkin-sections")?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }, 2600);
      }

      return next;
    });
  }

  return (
    <button
      type="button"
      aria-label={isOpen ? "Close closet door" : "Open closet door"}
      aria-pressed={isOpen}
      className={`closet-scene relative aspect-[4/5] w-full cursor-pointer border-0 bg-transparent p-0 text-left ${isOpen ? "is-open" : ""}`}
      onClick={handleToggle}
    >
      <span className="closet-light absolute left-1/2 top-[48%] h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full" />
      <span className="closet-frame absolute inset-x-[16%] bottom-[8%] top-[6%] rounded-t-full rounded-b-[3.2rem] border-[10px] border-[#4a3b31] bg-[#d8fafa]/55 shadow-2xl shadow-primary/20">
        <span className="absolute inset-x-10 top-12 h-20 rounded-t-full border-2 border-[#4a3b31]/25" />
        <span className="absolute inset-x-10 bottom-10 top-[55%] rounded-b-2xl border-2 border-[#4a3b31]/20" />
      </span>
      <span className="closet-door absolute bottom-[8%] left-[16%] top-[6%] w-[34%] rounded-bl-[3.2rem] rounded-tl-full rounded-tr-md border border-primary-foreground/25 bg-primary shadow-xl">
        <span className="absolute inset-x-5 top-12 h-20 rounded-t-full border-2 border-primary-foreground/30" />
        <span className="absolute inset-x-5 bottom-10 top-[55%] rounded-b-xl border-2 border-primary-foreground/24" />
        <span className="absolute right-3 top-1/2 h-3 w-3 rounded-full bg-[#d7d5e7] shadow-sm" />
        <span className="absolute left-0 top-0 h-full w-2 rounded-bl-[3.2rem] rounded-tl-full bg-white/10" />
      </span>
      <span className="closet-door right-door absolute bottom-[8%] right-[16%] top-[6%] w-[34%] rounded-br-[3.2rem] rounded-tl-md rounded-tr-full border border-primary-foreground/25 bg-primary shadow-xl">
        <span className="absolute inset-x-5 top-12 h-20 rounded-t-full border-2 border-primary-foreground/30" />
        <span className="absolute inset-x-5 bottom-10 top-[55%] rounded-b-xl border-2 border-primary-foreground/24" />
        <span className="absolute left-3 top-1/2 h-3 w-3 rounded-full bg-[#d7d5e7] shadow-sm" />
      </span>
      <span className="closet-title absolute left-1/2 top-1/2 text-center">
        <span className="font-title text-5xl font-bold text-primary drop-shadow-sm md:text-6xl">walkin⋆˙⟡</span>
      </span>
    </button>
  );
}
