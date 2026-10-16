import { useState } from "react";
import "./index.css";

function CustomNavbar({ data }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <main className="custom-navbar-demo">
      <nav
        className="navbar navbar-dark navbar-expand-lg bg-info custom-navbar"
        aria-label={data?.navigationAriaLabel ?? ""}
      >
        <div className="container-fluid custom-navbar-container">
          <a className="navbar-brand custom-navbar-brand" href="#home" aria-label={data?.logoHomeAriaLabel ?? ""}>
            {data?.logoText ?? ""}
          </a>
          <button
            className={`navbar-toggler custom-navbar-toggler${isExpanded ? "" : " collapsed"}`}
            type="button"
            aria-label={isExpanded ? data?.closeMenuLabel ?? "" : data?.openMenuLabel ?? ""}
            aria-controls="custom-navbar-navigation"
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded((expanded) => !expanded)}
          >
            <span className="navbar-toggler-icon" aria-hidden="true" />
          </button>
          <div
            id="custom-navbar-navigation"
            className={`collapse navbar-collapse custom-navbar-collapse${isExpanded ? " show" : ""}`}
          >
            <ul className="navbar-nav custom-navbar-nav">
              {(Array.isArray(data?.navigationLinks) ? data.navigationLinks : []).map(({ label, href }) => (
                <li className="nav-item" key={href}>
                  <a
                    className="nav-link custom-navbar-link"
                    href={href}
                    onClick={() => setIsExpanded(false)}
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

export default CustomNavbar;
