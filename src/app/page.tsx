import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Why from "@/components/Why";
import Calendar from "@/components/Calendar";
import Process from "@/components/Process";
import Industries from "@/components/Industries";
import Testimonials from "@/components/Testimonials";
import About from "@/components/About";
import Team from "@/components/Team";
import Location from "@/components/Location";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Services />
        <Why />
        <Process />
        <Calendar />
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
