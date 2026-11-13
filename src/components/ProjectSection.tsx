import { ArrowUpRight, Check, Clock, FolderGit2 } from "lucide-react";
import type { Project } from "../content";
import { person } from "../content";
import { timeAgo, useLastPush } from "../lib/github";
import Estimator from "./Estimator";

export default function ProjectSection({ project: p }: { project: Project }) {
  const pushed = useLastPush(person.githubUser, p.repo);
  const Icon = p.icon;
  const tall = p.image.shape === "tall";

  return (
    <article className={`project ${tall ? "project-tall" : "project-wide"}`} id={p.id} aria-labelledby={`${p.id}-title`}>
      <div className="project-intro">
        <span className="icon-tile" aria-hidden="true">
          <Icon size={22} strokeWidth={1.5} />
        </span>
        <h3 id={`${p.id}-title`}>{p.name}</h3>
        <p className="project-summary">{p.summary}</p>

        <div className="actions">
          {p.live && (
            <a className="btn btn-primary" href={p.live.href}>
              {p.live.label}
              <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />
            </a>
          )}
          <a className="btn btn-quiet" href={p.source.href}>
            <FolderGit2 size={18} strokeWidth={1.75} aria-hidden="true" />
            {p.source.label}
            <ArrowUpRight size={16} strokeWidth={1.75} className="icon-trail" aria-hidden="true" />
          </a>
        </div>

        <dl className="project-meta">
          <div>
            <dt>Built with</dt>
            <dd>{p.stack.join(", ")}</dd>
          </div>
          {pushed !== null && (
            <div className="project-updated">
              <dt>Last pushed</dt>
              <dd>
                {pushed ? (
                  <>
                    <Clock size={14} strokeWidth={1.75} aria-hidden="true" />
                    <time dateTime={pushed}>{timeAgo(pushed)}</time>
                  </>
                ) : (
                  <span className="placeholder">Checking GitHub</span>
                )}
              </dd>
            </div>
          )}
        </dl>
      </div>

      <figure className="plinth">
        <img src={p.image.src} width={p.image.width} height={p.image.height} alt={p.image.alt} loading="lazy" decoding="async" />
      </figure>

      <div className="project-body">
        <section className="block block-why">
          <h4>{p.why.title}</h4>
          {p.why.body.map((para) => (
            <p key={para.slice(0, 24)}>{para}</p>
          ))}
        </section>

        <section className="block block-decisions">
          <h4>{p.decisions.title}</h4>
          <dl className="decisions">
            {p.decisions.items.map((d) => (
              <div key={d.problem}>
                <dt>{d.problem}</dt>
                <dd>{d.solution}</dd>
              </div>
            ))}
          </dl>
        </section>

        {p.hasEstimator && (
          <section className="block block-full">
            <Estimator />
          </section>
        )}

        <section className="block block-full">
          <h4>How I know it works</h4>
          <ul className="proof">
            {p.proof.map((line) => (
              <li key={line}>
                <Check size={18} strokeWidth={1.75} aria-hidden="true" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>

        {p.note && (
          <section className="block block-full note">
            <h4>{p.note.title}</h4>
            <p>{p.note.body}</p>
          </section>
        )}
      </div>
    </article>
  );
}
