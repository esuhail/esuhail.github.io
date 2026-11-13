import { ArrowUpRight, Briefcase, FolderGit2, Mail } from "lucide-react";
import { person } from "../content";

export default function Contact() {
  return (
    <footer className="contact" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <h2 id="contact-title">Contact</h2>
        <a className="contact-email" href={`mailto:${person.email}`}>
          <Mail size={28} strokeWidth={1.25} aria-hidden="true" />
          <span>{person.email}</span>
        </a>
        <div className="contact-links">
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
