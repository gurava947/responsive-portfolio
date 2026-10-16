import { useEffect, useState } from "react";
import "./index.css";

function EcommerceWebsiteNavbarBanner({ data = {} }) {
  const slides = Array.isArray(data.carouselSlides) ? data.carouselSlides : [];
  const navigationLinks = Array.isArray(data.navigationLinks) ? data.navigationLinks : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!preference) return undefined;
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener?.("change", updatePreference);
    return () => preference.removeEventListener?.("change", updatePreference);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || slides.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, slides.length]);

  const showSlide = (index) => {
    if (!slides.length) return;
    setActiveIndex((index + slides.length) % slides.length);
  };

  const formatSlideLabel = (index) => (data.slideIndicatorLabel || "Go to slide {number}")
    .replace("{number}", String(index + 1));

  return (
    <main className="ecommerce-navbar-banner" id="home">
      <header className="ecommerce-navbar">
        <div className="ecommerce-navbar-shell">
          <div className="ecommerce-navbar-top">
            <a className="ecommerce-brand" href="#home" aria-label={data.logoHomeAriaLabel || "Fly Buy home"}>
              <img src={data.logoUrl} alt={data.logoAlt || "Fly Buy"} />
            </a>
            <button
              className="ecommerce-menu-toggle"
              type="button"
              aria-label={menuOpen ? (data.closeMenuLabel || "Close navigation menu") : (data.openMenuLabel || "Open navigation menu")}
              aria-expanded={menuOpen}
              aria-controls="ecommerce-primary-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
          <nav
            id="ecommerce-primary-menu"
            className={`ecommerce-nav-links${menuOpen ? " is-open" : ""}`}
            aria-label={data.navigationAriaLabel || "Fly Buy primary navigation"}
          >
            <ul>
              {navigationLinks.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <a href={link.href || "#home"} onClick={() => setMenuOpen(false)}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <section
        className="ecommerce-carousel"
        aria-label={data.carouselAriaLabel || "Featured offers"}
        aria-roledescription="carousel"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
        }}
      >
        <div className="ecommerce-carousel-track" aria-live="off">
          {slides.map((slide, index) => (
            <div
              className={`ecommerce-carousel-slide${index === activeIndex ? " is-active" : ""}`}
              key={slide.id || slide.alt || index}
              aria-hidden={index !== activeIndex}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}`}
            >
              <picture>
                <source media="(max-width: 767.98px)" srcSet={slide.smallImage} />
                <img
                  src={slide.wideImage}
                  alt={slide.alt || "Fly Buy seasonal offer"}
                  loading={index === activeIndex ? "eager" : "lazy"}
                  decoding="async"
                />
              </picture>
            </div>
          ))}
        </div>

        {slides.length > 1 && (
          <>
            <button
              className="ecommerce-carousel-control is-previous"
              type="button"
              aria-label={data.previousSlideLabel || "Previous slide"}
              onClick={() => showSlide(activeIndex - 1)}
            >
              <span aria-hidden="true">‹</span>
            </button>
            <button
              className="ecommerce-carousel-control is-next"
              type="button"
              aria-label={data.nextSlideLabel || "Next slide"}
              onClick={() => showSlide(activeIndex + 1)}
            >
              <span aria-hidden="true">›</span>
            </button>
            <div className="ecommerce-carousel-indicators" role="group" aria-label={data.slideControlsLabel || "Choose a banner"}>
              {slides.map((slide, index) => (
                <button
                  className={`ecommerce-carousel-indicator${index === activeIndex ? " is-active" : ""}`}
                  type="button"
                  key={slide.id || slide.alt || index}
                  aria-label={formatSlideLabel(index)}
                  aria-current={index === activeIndex ? "true" : undefined}
                  onClick={() => showSlide(index)}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default EcommerceWebsiteNavbarBanner;
