"use client";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function HeroFlash() {
  const container = useRef(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Track if the image has faded enough to show lightning
  const [isFaded, setIsFaded] = useState(false);

  // --- LIGHTNING ENGINE ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    const createLightning = () => {
      // Lightning Styling
      ctx.strokeStyle = "rgba(255, 255, 100, 0.9)";
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#fbbf24";

      let x = Math.random() * canvas.width;
      let y = 0;

      ctx.beginPath();
      ctx.moveTo(x, y);
      while (y < canvas.height) {
        x += (Math.random() - 0.5) * 60; // Jagged horizontal movement
        y += Math.random() * 35;        // Vertical progress
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      
      // Quick clear to create a "flash" flicker
      setTimeout(() => ctx.clearRect(0, 0, canvas.width, canvas.height), 60);
    };

    // Scroll Logic for Lightning
    ScrollTrigger.create({
      trigger: container.current,
      start: "top top",
      onUpdate: (self) => {
        const progress = self.progress;
        // ONLY ACTIVATE LIGHTNING IF:
        // 1. User is scrolling (velocity > 0)
        // 2. Main image has faded significantly (progress > 0.4)
        if (progress > 0.4 && Math.abs(self.getVelocity()) > 200) {
          if (Math.random() > 0.85) createLightning();
        }
      }
    });

    return () => window.removeEventListener("resize", resize);
  }, []);

  // --- ANIMATION TIMELINE ---
  useGSAP(() => {
    // 1. Image Fade & Blur Out
    gsap.to(".flash-bg", {
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "60% top",
        scrub: true,
      },
      opacity: 0,
      scale: 1.3,
      filter: "blur(30px) brightness(0)",
    });

    // 2. Background Content Reveal
    gsap.from(".reveal-text", {
      scrollTrigger: {
        trigger: ".next-section",
        start: "top 70%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      filter: "blur(10px)",
      y: 50,
      stagger: 0.2,
      duration: 1.5,
    });
  }, { scope: container });

  return (
    <div ref={container} className="relative bg-black">
      {/* LAYER 0: THE LIGHTNING CANVAS (Hidden until scroll) */}
      <canvas 
        ref={canvasRef} 
        className="pointer-events-none fixed inset-0 z-10" 
      />

      {/* SECTION 1: HERO */}
      <section className="relative h-[250vh] w-full">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          
          {/* THE MAIN IMAGE (Fades out) */}
          <div className="flash-bg absolute inset-0 z-20">
            <img 
              src="flash.jpg" 
              alt="The Flash" 
              className="h-full w-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black" />
          </div>

          {/* INITIAL HERO TEXT */}
          <div className="relative z-30 flex h-full flex-col items-center justify-center pointer-events-none">
            <h1 className="text-[15vw] font-black italic tracking-tighter text-yellow-400 drop-shadow-2xl opacity-80">
              FLASH
            </h1>
            <p className="text-sm tracking-[1.5em] text-white/40 uppercase">Scroll to enter speed force</p>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE BLACK VOID (Revealed) */}
      <section className="next-section relative z-30 min-h-screen bg-black flex items-center justify-center px-6">
        <div className="text-center max-w-5xl">
          <h2 className="reveal-text text-6xl md:text-9xl font-black italic text-red-600 mb-8 leading-none">
            TIME <br/> BREAKS.
          </h2>
          <p className="reveal-text text-xl md:text-3xl text-gray-400 font-medium leading-relaxed max-w-3xl mx-auto">
            As the physical form fades, only the energy remains. You are now moving 
            through the Speed Force where every scroll generates raw electricity.
          </p>
          <div className="reveal-text mt-16 w-32 h-1 bg-yellow-500 mx-auto shadow-[0_0_20px_#fbbf24]" />
        </div>
      </section>
    </div>
  );
}
