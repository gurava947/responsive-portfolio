import { useState } from "react";
import "./index.css";

function PortfolioWebsiteNavbarBanner({ data = {} }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = Array.isArray(data.navigationLinks) ? data.navigationLinks : [];

  return (
    <main className="portfolio-navbar-banner-demo" id="home">
      <nav className="portfolio-demo-navbar" aria-label={data.navigationAriaLabel || "Portfolio navigation"}>
        <div className="portfolio-demo-navbar-inner">
          <a className="portfolio-demo-logo" href="#home" aria-label={data.logoHomeAriaLabel || "Home"}>
            {data.logoText || "J."}
          </a>
          <button
            className={`portfolio-demo-menu-toggle${menuOpen ? " is-open" : ""}`}
            type="button"
            aria-label={menuOpen ? (data.closeMenuLabel || "Close navigation menu") : (data.openMenuLabel || "Open navigation menu")}
            aria-controls="portfolio-demo-navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span /><span /><span />
          </button>
          <div id="portfolio-demo-navigation" className={`portfolio-demo-navigation${menuOpen ? " is-open" : ""}`}>
            {links.map((link) => (
              <a
                className="portfolio-demo-nav-link"
                href={link.href}
                key={link.href}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <section className="portfolio-demo-hero" aria-labelledby="portfolio-demo-heading">
        <div className="portfolio-demo-hero-inner">
          <div className="portfolio-demo-copy">
            <h1 id="portfolio-demo-heading">
              {data.greeting || "Hey, I am"} <span>{data.name || "Jenny"}</span>
            </h1>
            <p>{data.role || "I am a Frontend Developer & Mentor."}</p>
            <a className="portfolio-demo-contact-button" href={data.contactHref || "#contact"}>
              {data.contactLabel || "Contact Me"}
            </a>
          </div>
          <div className="portfolio-demo-image-wrap">
            <img
              className="portfolio-demo-hero-image"
              src={data.bannerImage || "/portfolio-navbar-banner/banner.png"}
              alt={data.bannerImageAlt || "A developer working at a computer"}
              width="507"
              height="507"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

export default PortfolioWebsiteNavbarBanner;
