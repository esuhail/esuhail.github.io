import { skillGroups } from "../content";

export default function Skills() {
  return (
    <section className="section" id="skills" aria-labelledby="skills-title">
      <div className="container">
        <div className="section-head">
          <h2 id="skills-title">Skills</h2>
          <p>Each skill, and where you can see it used.</p>
        </div>
        <div className="skill-grid">
          {skillGroups.map((g) => (
            <section key={g.title} className="skill-group" aria-label={g.title}>
              <h3>{g.title}</h3>
              <ul>
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
