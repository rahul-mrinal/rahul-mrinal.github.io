import Hero from "../components/home/Hero";
import About from "../components/home/About";
import Experience from "../components/home/Experience";
import Projects from "../components/home/Projects";
import Skills from "../components/home/Skills";
import Education from "../components/home/Education";
import FeaturedBlog from "../components/home/FeaturedBlog";
import Contact from "../components/home/Contact";

export default function Home() {
  return (
    <main>
      <title>Rahul Mrinal - Generative AI Manager</title>
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Education />
      <FeaturedBlog />
      <Contact />
    </main>
  );
}
