import Contact from "./components/Contact";
import Education from "./components/Education";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProjectSection from "./components/ProjectSection";
import Skills from "./components/Skills";
import { projects } from "./content";
import { useReveal } from "./lib/reveal";

export default function App() {
  useReveal();

  return (
    <>
      <a className="skip" href="#work">Skip to work</a>
      <Header />
      <main>
        <Hero />
        <section className="section" id="work" aria-labelledby="work-title">
          <div className="container">
            <div className="section-head" data-reveal="stagger">
              <h2 id="work-title"><span className="mask"><span>Work</span></span></h2>
              <p>Three projects, each with a live link or source you can check.</p>
            </div>
            <div className="projects">
              {projects.map((p) => (
                <ProjectSection key={p.id} project={p} />
              ))}
            </div>
          </div>
        </section>
        <Skills />
        <Education />
      </main>
      <Contact />
    </>
  );
}
