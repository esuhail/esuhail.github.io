import { Award, GraduationCap } from "lucide-react";
import { education as e } from "../content";
import { stagger } from "../lib/reveal";

export default function Education() {
  return (
    <section className="section" id="education" aria-labelledby="education-title">
      <div className="container">
        <div className="section-head" data-reveal="stagger">
          <h2 id="education-title"><span className="mask"><span>Education</span></span></h2>
        </div>
        <div className="edu-grid">
          <div className="edu-item" data-reveal style={stagger(0)}>
            <span className="icon-tile" aria-hidden="true">
              <GraduationCap size={20} strokeWidth={1.5} />
            </span>
            <div>
              <h3>{e.school}</h3>
              <p className="edu-line">{e.degree}, {e.date}</p>
              <dl className="edu-facts">
                <div><dt>Location</dt><dd>{e.place}</dd></div>
                <div><dt>GPA</dt><dd>{e.gpa}</dd></div>
                <div><dt>Coursework</dt><dd>{e.coursework.join(", ")}</dd></div>
              </dl>
            </div>
          </div>
          <div className="edu-item" data-reveal style={stagger(1)}>
            <span className="icon-tile" aria-hidden="true">
              <Award size={20} strokeWidth={1.5} />
            </span>
            <div>
              <h3>Certifications</h3>
              <ul className="cert-list">
                {e.certifications.map((c) => (
                  <li key={c.name}>
                    <span>{c.name}</span>
                    <span className="cert-year">{c.year}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
