import Hero from "@/components/sections/Hero";
import VideoAccount from "@/components/sections/VideoAccount";
import MediaSection from "@/components/sections/MediaSection";
import DailyAccount from "@/components/sections/DailyAccount";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <VideoAccount />
      <MediaSection />
      <DailyAccount />
      <Contact />

      {/* Footer Placeholder */}
      <footer className="py-8 text-center text-sm text-[var(--text-secondary)]">
        <p>&copy; {new Date().getFullYear()} Gashin Suzuki. All rights reserved.</p>
      </footer>
    </main>
  );
}
