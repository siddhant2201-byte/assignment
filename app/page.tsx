import HeroSection from "./components/Hero";

export default function Home() {
  return (
    <main>
      <HeroSection />
      {/* Spacer to allow scrolling */}
      <div className="h-screen bg-white flex items-center justify-center">
        <h2 className="text-black text-2xl">Scroll back up to see the magic.</h2>
      </div>
    </main>
  );
}