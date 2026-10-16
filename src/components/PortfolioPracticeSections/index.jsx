import { useState } from "react";
import "./index.css";

function SectionTitle({ eyebrow, title }) {
  return <header className="portfolio-section-heading"><p>{eyebrow}</p><h2>{title}</h2></header>;
}

function PortfolioAboutMeSkills({ data = {} }) {
  const skills = Array.isArray(data.skills) ? data.skills : [];
  return (
    <main className="portfolio-about-skills-demo">
      <section className="portfolio-about-block" aria-labelledby="portfolio-about-title">
        <div className="portfolio-about-inner">
          <SectionTitle eyebrow={data.aboutEyebrow || "Facts"} title={data.aboutTitle || "About me"} />
          <div className="portfolio-about-layout">
            <img className="portfolio-about-photo" src={data.aboutImage || "/portfolio-sections/portfolio-about-me-img.png"} alt={data.aboutImageAlt || "Jenny Wilson outdoors"} />
            <div className="portfolio-about-copy">
              {(data.aboutParagraphs || []).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>
          </div>
        </div>
      </section>
      <section className="portfolio-skills-block" aria-labelledby="portfolio-skills-title">
        <div className="portfolio-about-inner">
          <h2 className="portfolio-skills-title" id="portfolio-skills-title">{data.skillsTitle || "Skills"}</h2>
          <div className="portfolio-skills-grid">
            {skills.map((skill) => (
              <article className="portfolio-skill-card" key={skill.name}>
                <img src={skill.image} alt="" loading="lazy" />
                <h3>{skill.name}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function PortfolioProjectsSection({ data = {} }) {
  const projects = Array.isArray(data.projects) ? data.projects : [];
  return (
    <main className="portfolio-projects-demo">
      <section className="portfolio-content-inner portfolio-projects-section" aria-labelledby="portfolio-projects-title">
        <SectionTitle eyebrow={data.eyebrow || "Portfolio"} title={data.title || "Projects I have done"} />
        <div className="portfolio-project-cards">
          {projects.map((project) => (
            <article className="portfolio-project-card" key={project.title}>
              <img src={project.image} alt={project.imageAlt || project.title} loading="lazy" />
              <div className="portfolio-project-card-body">
                <p className="portfolio-project-category">{project.category}</p>
                <h3>{project.title}</h3>
                <p className="portfolio-project-description">{project.description}</p>
                <a href={project.href || "#projects"} onClick={(event) => { if (!project.href || project.href === "#projects") event.preventDefault(); }}>
                  {data.readMoreLabel || "Read More"} <span aria-hidden="true">→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function PortfolioServicesSection({ data = {} }) {
  const services = Array.isArray(data.services) ? data.services : [];
  return (
    <main className="portfolio-services-demo">
      <section className="portfolio-content-inner portfolio-services-section" aria-labelledby="portfolio-services-title">
        <SectionTitle eyebrow={data.eyebrow || "Services"} title={data.title || "What I do"} />
        <div className="portfolio-services-grid">
          {services.map((service) => (
            <article className="portfolio-service-card" key={service.title}>
              <img src={service.image} alt="" loading="lazy" />
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function MetricIcon({ type }) {
  const props = { "aria-hidden": true, fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", viewBox: "0 0 48 48" };
  if (type === "thumb") return <svg {...props}><path d="M16 21 24 8c1.2-2 4.4-1.1 4.3 1.3L27 20h11a4 4 0 0 1 3.9 4.9l-3 14a4 4 0 0 1-3.9 3.1H16M7 21h9v21H7z" /></svg>;
  if (type === "file") return <svg {...props}><path d="M14 5h15l8 8v30H14zM29 5v9h8M20 22h11M20 29h11M20 36h8" /></svg>;
  return <svg {...props}><circle cx="24" cy="25" r="18" /><path d="M24 14v12l8 5M24 2v4M8 8l3 3M40 8l-3 3" /></svg>;
}

function PortfolioWorkDoneSection({ data = {} }) {
  const metrics = Array.isArray(data.metrics) ? data.metrics : [];
  return (
    <main className="portfolio-work-demo">
      <section className="portfolio-work-section" aria-label={data.ariaLabel || "Work completed"}>
        <div className="portfolio-work-inner">
          {metrics.map((metric) => (
            <article className="portfolio-work-metric" key={metric.label}>
              <MetricIcon type={metric.icon} />
              <span className="portfolio-work-rule" />
              <strong>{metric.value}</strong>
              <p>{metric.label}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function PortfolioTestimonialsSection({ data = {} }) {
  const testimonials = Array.isArray(data.testimonials) ? data.testimonials : [];
  const [active, setActive] = useState(0);
  const current = testimonials[active];
  const change = (offset) => setActive((index) => (index + offset + testimonials.length) % testimonials.length);
  if (!current) return <main className="portfolio-testimonials-demo" />;
  return (
    <main className="portfolio-testimonials-demo">
      <section className="portfolio-content-inner portfolio-testimonials-section" aria-labelledby="portfolio-testimonials-title">
        <SectionTitle eyebrow={data.eyebrow || "Testimonials"} title={data.title || "Our Members Says"} />
        <article className="portfolio-testimonial-card" aria-live="polite">
          <img src={current.image} alt={current.imageAlt || current.name} loading="lazy" />
          <blockquote>{current.quote}</blockquote>
          <p className="portfolio-testimonial-author">- {current.name}, {current.role}</p>
        </article>
        <div className="portfolio-testimonial-controls" role="group" aria-label={data.controlsLabel || "Choose testimonial"}>
          <button type="button" aria-label={data.previousLabel || "Previous testimonial"} onClick={() => change(-1)}><span aria-hidden="true">‹</span></button>
          <button type="button" aria-label={data.nextLabel || "Next testimonial"} onClick={() => change(1)}><span aria-hidden="true">›</span></button>
        </div>
      </section>
    </main>
  );
}

function ContactGlyph({ type }) {
  const common = { "aria-hidden": true, fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", viewBox: "0 0 24 24" };
  if (type === "phone") return <svg {...common}><path d="M7 3h3l2 5-2 2a15 15 0 0 0 4 4l2-2 5 2v3a2 2 0 0 1-2 2C10 18 5 13 5 5a2 2 0 0 1 2-2Z" /></svg>;
  if (type === "mail") return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>;
  return <svg {...common}><path d="M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12Z" /><circle cx="12" cy="9" r="2" /></svg>;
}

function PortfolioFooterSection({ data = {} }) {
  return (
    <main className="portfolio-footer-demo">
      <footer className="portfolio-footer-section">
        <div className="portfolio-footer-inner">
          <section className="portfolio-footer-profile">
            <img src={data.profileImage || "/portfolio-sections/portfolio-about-me-img.png"} alt={data.profileImageAlt || "Jenny Wilson"} loading="lazy" />
            <div><h2>{data.name || "Jenny"}</h2><p>{data.role || "Frontend Developer"}</p></div>
          </section>
          {(data.contacts || []).map((contact) => (
            <section className="portfolio-footer-contact" key={contact.heading}>
              <h2>{contact.heading}</h2>
              <p><ContactGlyph type={contact.icon} /><a href={contact.href}>{contact.value}</a></p>
            </section>
          ))}
        </div>
        <p className="portfolio-footer-copyright">{data.copyright || "© 2020 by Jenny Wilson. Created with Bootstrap."}</p>
      </footer>
    </main>
  );
}

export {
  PortfolioAboutMeSkills,
  PortfolioProjectsSection,
  PortfolioServicesSection,
  PortfolioWorkDoneSection,
  PortfolioTestimonialsSection,
  PortfolioFooterSection,
};
