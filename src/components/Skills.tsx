import { skillGroups } from "../content";
import { stagger } from "../lib/reveal";

export default function Skills() {
  return (
    <section className="section" id="skills" aria-labelledby="skills-title">
      <div className="container">
        <div className="section-head" data-reveal="stagger">
          <h2 id="skills-title"><span className="mask"><span>Skills</span></span></h2>
          <p>Each skill, and where you can see it used.</p>
        </div>
        <div className="skill-grid">
          {skillGroups.map((g, gi) => (
            <section key={g.title} className="skill-group" aria-label={g.title} style={stagger(gi % 2)}>
              <h3 data-reveal>{g.title}</h3>
              <ul data-reveal="stagger">
                {g.skills.map((s) => (
                  <li key={s.name}>
                    <span className="skill-name">{s.name}</span>
                    <span className="skill-where">{s.usedIn.join(", ")}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
