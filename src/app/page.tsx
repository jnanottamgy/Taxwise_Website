import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Why from "@/components/Why";
import Calendar from "@/components/Calendar";
import CalendarYear from "@/components/CalendarYear";
import Process from "@/components/Process";
import Industries from "@/components/Industries";
import Testimonials from "@/components/Testimonials";
import About from "@/components/About";
import Team from "@/components/Team";
import Location from "@/components/Location";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  // The page is prerendered, so this is the build date, not the reader's. It
  // is handed to the calendar so the server render and the first client render
  // agree exactly; the calendar corrects itself to the real today on mount.
  const build = new Date();
  const buildDate = `${build.getFullYear()}-${String(build.getMonth() + 1).padStart(2, "0")}-${String(build.getDate()).padStart(2, "0")}`;

  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Services />
        <Why />
        <Process />
        <Calendar today={buildDate}>
          <CalendarYear />
        </Calendar>
        <Industries />
        <Testimonials />
        <About />
        <Team />
        <Location />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
