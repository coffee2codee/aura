import Hero from "../components/Hero";
import Story from "../components/Story";
import { Intro, Featured, Locations, Why, About, CTA, Contact } from "../components/Sections";

// Order matches the navbar: Properties → About → Locations → Contact
export default function Home({ ready }) {
  return (
    <main>
      <Hero ready={ready} />
      <Intro />
      <Featured />
      <Story />
      <Why />
      <About />
      <Locations />
      <CTA />
      <Contact />
    </main>
  );
}
