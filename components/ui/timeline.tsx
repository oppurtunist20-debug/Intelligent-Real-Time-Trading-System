"use client";
import {
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref, data]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full font-sans"
      ref={containerRef}
    >
      <div ref={ref} className="relative w-full pb-20">
        {data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0.1, scale: 0.9, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex justify-start py-20 md:py-32 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-24 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-8 absolute left-3 md:left-3 w-8 rounded-full bg-[#1A1D21] flex items-center justify-center border border-white/10 shadow-sm">
                <div className="h-3 w-3 rounded-full bg-[#f0b90b] border border-[#f0b90b]/50 p-2 shadow-inner" />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-white/50">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-16 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-3xl mb-4 text-left font-extrabold text-white tracking-tight leading-tight">
                {item.title}
              </h3>
              {item.content}{" "}
            </div>
          </motion.div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-7 left-7 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-white/5 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-[#f0b90b] via-amber-200 to-transparent from-[0%] via-[10%] rounded-full shadow-[0_0_10px_#f0b90b]"
          />
        </div>
      </div>
    </div>
  );
};
