import { useState } from "react";
import "./index.css";

function VrWebsiteNavbarBanner({ data }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <main className="vr-website-demo">
      <nav className="navbar navbar-expand-lg navbar-light bg-light vr-navbar" aria-label={data?.navigationAriaLabel ?? ""}>
        <div className="container">
          <img src={data?.logoUrl ?? ""} alt={data?.logoAlt ?? ""} className="image" loading="lazy" decoding="async" />
          <button
            className={`navbar-toggler${isExpanded ? "" : " collapsed"}`}
            type="button"
            aria-label={isExpanded ? data?.closeMenuLabel ?? "" : data?.openMenuLabel ?? ""}
            data-toggle="collapse"
            data-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded((expanded) => !expanded)}
          >
            <span className="navbar-toggler-icon" aria-hidden="true" />
          </button>
          <div
            className={`collapse navbar-collapse${isExpanded ? " show" : ""}`}
            id="navbarNavAltMarkup"
          >
            <div className="navbar-nav ml-auto">
              {(Array.isArray(data?.navigationLinks) ? data.navigationLinks : []).map(({ label, id }, index) => (
                <a
                  className={`nav-link${index === 0 ? " active" : ""}`}
                  id={id}
                  href="#navbarNavAltMarkup"
                  key={id}
                  onClick={(event) => {
                    event.preventDefault();
                    setIsExpanded(false);
                  }}
                >
                  {label ?? ""}
                  {index === 0 && <span className="sr-only">{data?.currentIndicatorText ?? ""}</span>}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div
              className="Background-section d-flex flex-column justify-content-center"
              style={{ backgroundImage: data?.bannerUrl ? `url("${data.bannerUrl}")` : "none" }}
            >
              <div className="text-center">
                <h1 className="Vr-heading">{data?.bannerHeading ?? ""}</h1>
                <button className="Vr-button" type="button">{data?.bannerButtonLabel ?? ""}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default VrWebsiteNavbarBanner;
