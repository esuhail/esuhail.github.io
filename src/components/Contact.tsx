import { ArrowUpRight, Briefcase, FolderGit2, Mail } from "lucide-react";
import { person } from "../content";
import { stagger } from "../lib/reveal";

export default function Contact() {
  return (
    <footer className="contact" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <h2 id="contact-title" data-reveal className="mask-host"><span className="mask"><span>Contact</span></span></h2>
        <a className="contact-email" data-reveal style={stagger(1)} href={`mailto:${person.email}`}>
          <Mail size={28} strokeWidth={1.25} aria-hidden="true" />
          <span>{person.email}</span>
        </a>
        <div className="contact-links" data-reveal style={stagger(2)}>
          <a href={person.github}>
            <FolderGit2 size={18} strokeWidth={1.75} aria-hidden="true" />
            GitHub
            <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />
          </a>
          <a href={person.linkedin}>
            <Briefcase size={18} strokeWidth={1.75} aria-hidden="true" />
            LinkedIn
            <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />
          </a>
        </div>
        <div className="contact-base">
          <span>© {new Date().getFullYear()} {person.name}</span>
          <a href="https://github.com/esuhail/esuhail.github.io">View this site's source</a>
        </div>
      </div>
    </footer>
  );
}
