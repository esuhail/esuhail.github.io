import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { person } from "../content";

const links = [
  { href: "#work", label: "Work" },
  { href: "#skills", label: "Skills" },
  { href: "#education", label: "Education" },
];

export default function Header() {
  // The hairline under the header only appears once the page has scrolled,
  // so the top of the page stays one clean surface.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`header${scrolled ? " is-scrolled" : ""}`}>
      <div className="container header-inner">
        <a href="#top" className="wordmark" aria-label={`${person.name}, back to top`}>
          <span className="wordmark-full">{person.name}</span>
          <span className="wordmark-short" aria-hidden="true">ES</span>
        </a>
        <nav aria-label="Sections" className="nav">
          {links.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
          <a href="#contact" className="btn btn-quiet btn-sm">
            <Mail size={16} strokeWidth={1.75} aria-hidden="true" />
            <span>Contact</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
