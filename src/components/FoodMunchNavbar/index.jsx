import { useState } from "react";
import "./index.css";

function FoodMunchNavbar({ data }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <main className="food-munch-demo">
      <nav
        className="navbar navbar-dark navbar-expand-lg bg-dark food-munch-navbar"
        aria-label={data?.navigationAriaLabel ?? ""}
      >
        <div className="container-fluid food-munch-navbar-container">
          <a className="navbar-brand food-munch-brand" href="#home" aria-label={data?.logoHomeAriaLabel ?? ""}>
            <img
              src={data?.logoUrl ?? ""}
              alt={data?.logoAlt ?? ""}
              className="food-munch-logo"
              loading="lazy"
              decoding="async"
            />
          </a>
          <button
            className={`navbar-toggler food-munch-toggler${isExpanded ? "" : " collapsed"}`}
            type="button"
            aria-label={isExpanded ? data?.closeMenuLabel ?? "" : data?.openMenuLabel ?? ""}
            aria-controls="food-munch-navigation"
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded((expanded) => !expanded)}
          >
            <span className="navbar-toggler-icon" aria-hidden="true" />
          </button>
          <div
            id="food-munch-navigation"
            className={`collapse navbar-collapse food-munch-collapse${isExpanded ? " show" : ""}`}
          >
            <ul className="navbar-nav ms-auto food-munch-nav-list">
              {(Array.isArray(data?.navigationLinks) ? data.navigationLinks : []).map(({ label, href }) => (
                <li className="nav-item" key={href}>
                  <a
                    className="nav-link food-munch-nav-link"
                    href={href}
                    onClick={(event) => {
                      event.preventDefault();
                      setIsExpanded(false);
                    }}
                  >
                    {label ?? ""}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </main>
  );
}

export default FoodMunchNavbar;
