import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_THEME_SETTINGS } from "../hooks/useTheme";

function ProjectCard({ project, onOpen, settings = DEFAULT_THEME_SETTINGS, copy = { viewProject: "View Project", viewProjectAria: "View {title} project" } }) {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef(null);
  const touchPointer = useRef(false);
  const cardUI = settings.cardUI || {};
  const prefersReducedMotion = settings.reducedMotion || Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);
  const [revealed, setRevealed] = useState(!cardUI.scrollReveal || prefersReducedMotion);

  useEffect(() => {
    if (!cardUI.scrollReveal || prefersReducedMotion || !window.IntersectionObserver) {
      setRevealed(true);
      return undefined;
    }
    setRevealed(false);
    const card = cardRef.current;
    if (!card) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setRevealed(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(card);
    return () => observer.disconnect();
  }, [cardUI.scrollReveal, prefersReducedMotion]);

  const onPointerMove = useCallback((event) => {
    if (event.pointerType === "touch") return;
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const percentX = (x / bounds.width) * 100;
    const percentY = (y / bounds.height) * 100;

    card.style.setProperty("--spotlight-x", `${percentX}%`);
    card.style.setProperty("--spotlight-y", `${percentY}%`);
    card.style.setProperty("--spotlight-opacity", settings.cursorSpotlight ? "1" : "0");

    if (settings.cardTilt && !settings.reducedMotion && settings.animationIntensity !== "none") {
      const tiltX = ((percentX - 50) / 50) * 2.5;
      const tiltY = ((50 - percentY) / 50) * 2.5;
      card.style.setProperty("--tilt-x", `${tiltX}deg`);
      card.style.setProperty("--tilt-y", `${tiltY}deg`);
    }
  }, [settings.cardTilt, settings.cursorSpotlight, settings.reducedMotion, settings.animationIntensity]);

  const onPointerLeave = useCallback((event) => {
    const card = event.currentTarget;
    card.style.setProperty("--spotlight-x", "50%");
    card.style.setProperty("--spotlight-y", "0%");
    card.style.setProperty("--spotlight-opacity", "0");
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  }, []);

  const category = project.categoryFilter?.toLowerCase() || project.category.split("·")[1]?.trim().toLowerCase() || "default";

  return (
    <article className="col-12 col-md-6 col-xl-4">
      <a
        ref={cardRef}
        className={`project-card card h-100 text-decoration-none${expanded ? " is-expanded" : ""}${revealed ? " is-revealed" : ""}`}
        href={project.route}
        onClick={(event) => {
          if (touchPointer.current) {
            touchPointer.current = false;
            if (!expanded) {
              event.preventDefault();
              setExpanded(true);
              return;
            }
          }
          onOpen(event, project.id);
        }}
        onPointerDown={(event) => {
          touchPointer.current = event.pointerType === "touch";
        }}
        onPointerCancel={() => {
          touchPointer.current = false;
        }}
        onFocus={() => {
          if (!touchPointer.current) setExpanded(true);
        }}
        onBlur={() => {
          if (!touchPointer.current) setExpanded(false);
        }}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        data-category={category}
        data-hover-glow={String(settings.hoverGlow)}
        data-cursor-spotlight={String(settings.cursorSpotlight)}
        data-scroll-reveal={String(Boolean(cardUI.scrollReveal && !settings.reducedMotion))}
        data-entrance={settings.reducedMotion ? "none" : cardUI.entranceIntensity || "none"}
        data-press-feedback={String(Boolean(cardUI.pressFeedback))}
        aria-label={copy.viewProjectAria.replace("{title}", project.title)}
      >
        <div className="project-card-image-wrap">
          <img
            className="project-card-image"
            src={project.image}
            alt={project.imageAlt || `${project.title} project thumbnail`}
            data-fallback-category={project.category}
            loading="lazy"
          />
          <span className="project-card-arrow" aria-hidden="true">↗</span>
        </div>
        <div className="card-body d-flex flex-column p-4">
          <span className="project-category">{project.category}</span>
          <h3 className="h5 project-card-title mb-0 mt-2">{project.title}</h3>
        </div>
        <div
          className="project-card-details"
          id={`project-card-details-${project.id}`}
        >
          <span className="project-category">{project.category}</span>
          <span className="h5 project-card-title d-block mb-3 mt-2" aria-hidden="true">{project.title}</span>
          <p className="project-card-description">{project.description}</p>
          <ul className="project-tech-list" role="list" aria-label="Technologies used">
            {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
          </ul>
          {(project.rating || project.status || project.ageBadge) && (
            <div className="project-card-meta">
              {project.rating && <span>{project.rating}</span>}
              {project.status && <span>{project.status}</span>}
              {project.ageBadge && <span>{project.ageBadge}</span>}
            </div>
          )}
          <span className="project-card-action">{copy.viewProject} <span aria-hidden="true">↗</span></span>
        </div>
      </a>
    </article>
  );
}

export default ProjectCard;
