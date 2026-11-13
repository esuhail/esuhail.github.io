import { useState } from "react";
import { ArrowUpRight, Briefcase, Check, Clock, Copy, FolderGit2, Mail } from "lucide-react";
import { person } from "../content";
import { timeAgo, useLatestPush } from "../lib/github";

export default function Hero() {
  const latest = useLatestPush(person.githubUser);
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: the address is still selectable text */
    }
  };

  return (
    <section className="hero" id="top">
      <div className="container">
        <h1 className="hero-name">{person.name}</h1>
        <p className="hero-intro">{person.intro}</p>

        <div className="hero-email">
          <a href={`mailto:${person.email}`}>{person.email}</a>
          <button type="button" className="copy" onClick={copyEmail} aria-label={copied ? "Email copied" : "Copy email address"}>
            {copied ? <Check size={16} strokeWidth={1.75} aria-hidden="true" /> : <Copy size={16} strokeWidth={1.75} aria-hidden="true" />}
            <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>

        <div className="actions">
          <a className="btn btn-primary" href={`mailto:${person.email}`}>
            <Mail size={18} strokeWidth={1.75} aria-hidden="true" />
            Email me
          </a>
          <a className="btn btn-quiet" href={person.github}>
            <FolderGit2 size={18} strokeWidth={1.75} aria-hidden="true" />
            GitHub
            <ArrowUpRight size={16} strokeWidth={1.75} className="icon-trail" aria-hidden="true" />
          </a>
          <a className="btn btn-quiet" href={person.linkedin}>
            <Briefcase size={18} strokeWidth={1.75} aria-hidden="true" />
            LinkedIn
            <ArrowUpRight size={16} strokeWidth={1.75} className="icon-trail" aria-hidden="true" />
          </a>
        </div>

        {/* Reserve the line's height so nothing shifts when the data arrives. */}
        <p className="hero-activity" aria-live="polite">
          {latest && (
            <>
              <Clock size={16} strokeWidth={1.75} aria-hidden="true" />
              <span>
                Last pushed to <a href={latest.url}>{latest.repo}</a>{" "}
                <time dateTime={latest.at}>{timeAgo(latest.at)}</time>
              </span>
            </>
          )}
        </p>
      </div>
    </section>
  );
}
