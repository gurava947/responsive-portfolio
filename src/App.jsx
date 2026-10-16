import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import "./styles/theme.css";
import "./App.css";
import "./styles/portfolio-effects.css";
import { useTheme } from "./hooks/useTheme";
import { usePortfolioData } from "./hooks/usePortfolioData";
import ProjectCard from "./components/ProjectCard";
import DatabaseProjectPreview from "./components/DatabaseProjectPreview";
import { attachImageFallbacks } from "./utils/imageFallback";
import CertificateShowcase from "./components/CertificateShowcase";
import FoodMunchNavbar from "./components/FoodMunchNavbar";
import ResponsiveColorPalette from "./components/ResponsiveColorPalette";
import ProfilePage from "./components/ProfilePage";
import TodoList from "./components/TodoList";
import CssTypeSelector from "./components/CssTypeSelector";
import SpecificityPracticeFour from "./components/SpecificityPracticeFour";
import CustomNavbar from "./components/CustomNavbar";
import SpecificityPracticeFive from "./components/SpecificityPracticeFive";
import SpecificityPracticeSix from "./components/SpecificityPracticeSix";
import VrWebsiteNavbarBanner from "./components/VrWebsiteNavbarBanner";
import VrWebsiteFeatures from "./components/VrWebsiteFeatures";
import VrWebsiteKit from "./components/VrWebsiteKit";
import VrWebsiteContactUsSection from "./components/VrWebsiteContactUsSection";
import VrWebsiteProducts from "./components/VrWebsiteProducts";
import VrWebsiteFooterSection from "./components/VrWebsiteFooterSection";
import PortfolioWebsiteNavbarBanner from "./components/PortfolioWebsiteNavbarBanner";
import EcommerceWebsiteNavbarBanner from "./components/EcommerceWebsiteNavbarBanner";
import {
  PortfolioAboutMeSkills,
  PortfolioProjectsSection,
  PortfolioServicesSection,
  PortfolioWorkDoneSection,
  PortfolioTestimonialsSection,
  PortfolioFooterSection,
} from "./components/PortfolioPracticeSections";
import {
  ResponsiveFeaturesSection,
  DesignToolsSection,
  DesignDeliverSection,
  LogosSection,
  DesignToolNavbarBanner,
  EcommerceFooterSection,
  EcommerceContactUsSection,
  EcommerceExploreSection,
  EcommerceTrendingBlogsSection,
  EcommerceOffersSection,
  EcommerceProductsSection,
  EcommerceServicesSection,
} from "./components/ResponsiveCourseSections";

const projectComponents = {
  "responsive-color-palette": ResponsiveColorPalette,
  "food-munch-navbar": FoodMunchNavbar,
  "profile-page": ProfilePage,
  "todo-list": TodoList,
  "css-type-selector": CssTypeSelector,
  "specificity-practice-four": SpecificityPracticeFour,
  "custom-navbar": CustomNavbar,
  "specificity-practice-five": SpecificityPracticeFive,
  "specificity-practice-six": SpecificityPracticeSix,
  "vr-website-navbar-banner": VrWebsiteNavbarBanner,
  "vr-website-features": VrWebsiteFeatures,
  "vr-website-kit": VrWebsiteKit,
  "vr-website-contact-us-section": VrWebsiteContactUsSection,
  "vr-website-products": VrWebsiteProducts,
  "vr-website-footer-section": VrWebsiteFooterSection,
  "portfolio-website-navbar-banner": PortfolioWebsiteNavbarBanner,
  "portfolio-about-me-skills": PortfolioAboutMeSkills,
  "portfolio-projects-section": PortfolioProjectsSection,
  "portfolio-services-section": PortfolioServicesSection,
  "portfolio-work-done-section": PortfolioWorkDoneSection,
  "portfolio-testimonials-section": PortfolioTestimonialsSection,
  "portfolio-footer-section": PortfolioFooterSection,
  "ecommerce-website-navbar-banner": EcommerceWebsiteNavbarBanner,
  "responsive-features-section": ResponsiveFeaturesSection,
  "responsive-tools-section": DesignToolsSection,
  "responsive-design-deliver-section": DesignDeliverSection,
  "responsive-logos-section": LogosSection,
  "design-tool-navbar-banner": DesignToolNavbarBanner,
  "ecommerce-footer-section": EcommerceFooterSection,
  "ecommerce-contact-us-section": EcommerceContactUsSection,
  "ecommerce-explore-section": EcommerceExploreSection,
  "ecommerce-trending-blogs-section": EcommerceTrendingBlogsSection,
  "ecommerce-offers-section": EcommerceOffersSection,
  "ecommerce-products-section": EcommerceProductsSection,
  "ecommerce-services-section": EcommerceServicesSection,
};

const PROFILE_STORAGE_KEY = "myapp.guravva.profile.v1";

function NavIcon({ name }) {
  const iconProps = {
    "aria-hidden": true,
    className: "nav-control-icon",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
  };

  if (name === "sun") {
    return <svg {...iconProps}><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></svg>;
  }
  return <svg {...iconProps}><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.7 8.7 0 1 0 20.5 14.2Z" /></svg>;
}

function ProfileIcon({ name }) {
  const common = {
    "aria-hidden": true,
    className: "profile-icon",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
  };
  if (name === "edit") return <svg {...common}><path d="m15 5 4 4M4 20l4-.8L19 8a2.1 2.1 0 0 0-3-3L5 16l-1 4Z" /></svg>;
  if (name === "plus") return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>;
  if (name === "remove") return <svg {...common}><path d="M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>;
  if (name === "save") return <svg {...common}><path d="m5 12 4 4L19 6" /></svg>;
  return <svg {...common}><path d="M14 3h7v7m-1-6-9 9M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6" /></svg>;
}

function externalProfileUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
  } catch {
    return "";
  }
}

function readSavedProfile(defaultProfile) {
  try {
    const saved = window.sessionStorage.getItem(PROFILE_STORAGE_KEY);
    if (!saved) return defaultProfile;
    const parsed = JSON.parse(saved);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return defaultProfile;
    const profile = { ...defaultProfile };
    Object.keys(defaultProfile).forEach((field) => {
      if (field !== "links" && typeof parsed[field] === "string") profile[field] = parsed[field];
    });
    if (typeof defaultProfile.email === "string") profile.email = defaultProfile.email;
    if (Array.isArray(parsed.links)) {
      profile.links = parsed.links
        .filter((link) => link && typeof link.label === "string" && link.label.trim() && typeof link.url === "string" && externalProfileUrl(link.url))
        .map(({ label, url }) => ({ label, url }));
    }
    return profile;
  } catch (error) {
    console.warn("Unable to read the saved profile.", error);
    return defaultProfile;
  }
}

const CARD_UI_NUMBER_CONTROLS = {
  Shape: [
    ["radius", "Overall radius", 0, 40, 1, "px"],
    ["topLeftRadius", "Top-left radius", 0, 40, 1, "px"],
    ["topRightRadius", "Top-right radius", 0, 40, 1, "px"],
    ["bottomRightRadius", "Bottom-right radius", 0, 40, 1, "px"],
    ["bottomLeftRadius", "Bottom-left radius", 0, 40, 1, "px"],
  ],
  Borders: [
    ["borderTopWidth", "Top border width", 0, 8, 1, "px"],
    ["borderRightWidth", "Right border width", 0, 8, 1, "px"],
    ["borderBottomWidth", "Bottom border width", 0, 8, 1, "px"],
    ["borderLeftWidth", "Left border width", 0, 8, 1, "px"],
  ],
  Sizing: [
    ["maxWidth", "Card max width", 240, 520, 10, "px"],
    ["minHeight", "Card minimum height", 0, 600, 10, "px"],
  ],
  CardHeight: [
    ["mobileImageHeight", "Mobile image height", 120, 240, 5, "px"],
    ["tabletImageHeight", "Tablet image height", 140, 280, 5, "px"],
    ["desktopImageHeight", "Desktop image height", 160, 320, 5, "px"],
  ],
  Typography: [
    ["fontSize", "Font size", 12, 24, 1, "px"],
    ["fontWeight", "Font weight", 300, 800, 100, ""],
  ],
  Motion: [
    ["hoverScale", "Hover scale", 1, 1.04, 0.01, "×"],
    ["transitionDuration", "Transition duration", 0, 600, 25, "ms"],
  ],
};

const CARD_UI_COLOR_CONTROLS = [
  ["backgroundColor", "Card background"],
  ["borderColor", "Card border"],
  ["textColor", "Card text"],
  ["borderTopColor", "Top border"],
  ["borderRightColor", "Right border"],
  ["borderBottomColor", "Bottom border"],
  ["borderLeftColor", "Left border"],
];

const CARD_UI_SELECT_CONTROLS = [
  ["fontFamily", "Font family", [
    ["theme", "Theme default"], ["system", "System UI"], ["arial", "Arial"], ["georgia", "Georgia"], ["monospace", "Monospace"],
  ]],
  ["hoverHighlight", "Hover highlight", [
    ["none", "None"], ["subtle", "Subtle"], ["medium", "Medium"],
  ]],
  ["transitionEasing", "Transition easing", [
    ["smooth", "Smooth"], ["standard", "Standard"],
  ]],
  ["entranceIntensity", "Entrance animation", [
    ["none", "None"], ["subtle", "Subtle"], ["medium", "Medium"],
  ]],
];

function CardUIColorControl({ setting, label, value, onChange, themeMode }) {
  const dark = themeMode === "dark";
  const themeColor = setting === "backgroundColor" ? (dark ? "#202822" : "#ffffff")
    : setting === "textColor" ? (dark ? "#eef2e8" : "#18231d")
      : dark ? "#3a453b" : "#dfe8d9";

  return (
    <div className="card-ui-color-control">
      <label htmlFor={`card-ui-${setting}`}>{label}</label>
      <div className="card-ui-color-row">
        <input
          id={`card-ui-${setting}`}
          type="color"
          value={value === "theme" ? themeColor : value}
          onChange={(event) => onChange(setting, event.target.value)}
          aria-label={`${label} color`}
        />
        <button
          type="button"
          className="card-ui-theme-color"
          onClick={() => onChange(setting, "theme")}
          aria-pressed={value === "theme"}
        >
          Theme
        </button>
      </div>
    </div>
  );
}

function CardUISettings({ settings, onChange, onReset, themeMode }) {
  const setValue = (key, value) => {
    if (key === "radius") {
      onChange({
        radius: value,
        topLeftRadius: value,
        topRightRadius: value,
        bottomRightRadius: value,
        bottomLeftRadius: value,
      });
      return;
    }
    onChange({ [key]: value });
  };

  return (
    <fieldset className="card-ui-settings">
      <div className="card-ui-settings-heading">
        <legend>Cards Layout</legend>
        <button type="button" className="card-ui-reset" onClick={onReset}>Reset cards</button>
      </div>
      <p className="card-ui-hint">Changes apply to all project cards and save automatically. Low-contrast custom colors revert to theme colors.</p>
      <div className="card-ui-settings-grid">
        {CARD_UI_NUMBER_CONTROLS.Motion.slice(0, 1).map(([key, label, min, max, step, unit]) => (
          <div className="card-ui-range" key={key}>
            <div><label htmlFor={`card-ui-${key}`}>{label}</label><output aria-hidden="true">{settings[key]}{unit}</output></div>
            <input id={`card-ui-${key}`} type="range" min={min} max={max} step={step} value={settings[key]} onChange={(event) => setValue(key, Number(event.target.value))} />
          </div>
        ))}
        <CardUIColorControl setting="backgroundColor" label="Card background" value={settings.backgroundColor} onChange={setValue} themeMode={themeMode} />
        <CardUIColorControl setting="borderColor" label="Card border color" value={settings.borderColor} onChange={setValue} themeMode={themeMode} />
        <CardUIColorControl setting="textColor" label="Card text color" value={settings.textColor} onChange={setValue} themeMode={themeMode} />
        {CARD_UI_SELECT_CONTROLS.slice(1, 2).map(([key, label, options]) => (
          <label className="card-ui-select" htmlFor={`card-ui-${key}`} key={key}>
            <span>{label}</span>
            <select id={`card-ui-${key}`} value={settings[key]} onChange={(event) => setValue(key, event.target.value)}>
              {options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
            </select>
          </label>
        ))}
      </div>
      {Object.entries(CARD_UI_NUMBER_CONTROLS).filter(([group]) => group !== "Motion").map(([group, controls]) => (
        <details className="card-ui-details" key={group}>
          <summary>{group}</summary>
          <div className="card-ui-settings-grid">
            {controls.map(([key, label, min, max, step, unit]) => (
              <div className="card-ui-range" key={key}>
                <div><label htmlFor={`card-ui-${key}`}>{label}</label><output aria-hidden="true">{settings[key]}{unit}</output></div>
                <input id={`card-ui-${key}`} type="range" min={min} max={max} step={step} value={settings[key]} onChange={(event) => setValue(key, Number(event.target.value))} />
              </div>
            ))}
            {group === "Borders" && CARD_UI_COLOR_CONTROLS.slice(3).map(([key, label]) => (
              <CardUIColorControl key={key} setting={key} label={label} value={settings[key]} onChange={setValue} themeMode={themeMode} />
            ))}
            {group === "Typography" && (
              CARD_UI_SELECT_CONTROLS.slice(0, 1).map(([key, label, options]) => (
                <label className="card-ui-select" htmlFor={`card-ui-${key}`} key={key}>
                  <span>{label}</span>
                  <select id={`card-ui-${key}`} value={settings[key]} onChange={(event) => setValue(key, event.target.value)}>
                    {options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
                  </select>
                </label>
              ))
            )}
          </div>
        </details>
      ))}
      <details className="card-ui-details">
        <summary>Card Height</summary>
        <div className="card-ui-details-heading">
          <span>Portfolio thumbnail heights by screen size</span>
          <button
            type="button"
            className="card-ui-reset"
            onClick={() => onChange({
              mobileImageHeight: 150,
              tabletImageHeight: 175,
              desktopImageHeight: 190,
            })}
          >
            Reset height
          </button>
        </div>
        <div className="card-ui-settings-grid">
          {CARD_UI_NUMBER_CONTROLS.CardHeight.map(([key, label, min, max, step, unit]) => (
            <div className="card-ui-range" key={key}>
              <div><label htmlFor={`card-ui-${key}`}>{label}</label><output aria-hidden="true">{settings[key]}{unit}</output></div>
              <input id={`card-ui-${key}`} type="range" min={min} max={max} step={step} value={settings[key]} onChange={(event) => setValue(key, Number(event.target.value))} />
            </div>
          ))}
        </div>
      </details>
      <details className="card-ui-details">
        <summary>Motion and responsive behavior</summary>
        <div className="card-ui-settings-grid">
          {CARD_UI_NUMBER_CONTROLS.Motion.slice(1).map(([key, label, min, max, step, unit]) => (
            <div className="card-ui-range" key={key}>
              <div><label htmlFor={`card-ui-${key}`}>{label}</label><output aria-hidden="true">{settings[key]}{unit}</output></div>
              <input id={`card-ui-${key}`} type="range" min={min} max={max} step={step} value={settings[key]} onChange={(event) => setValue(key, Number(event.target.value))} />
            </div>
          ))}
          {CARD_UI_SELECT_CONTROLS.slice(2).map(([key, label, options]) => (
            <label className="card-ui-select" htmlFor={`card-ui-${key}`} key={key}>
              <span>{label}</span>
              <select id={`card-ui-${key}`} value={settings[key]} onChange={(event) => setValue(key, event.target.value)}>
                {options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
              </select>
            </label>
          ))}
          {[
            ["scrollReveal", "Scroll reveal"],
            ["pressFeedback", "Click/press feedback"],
            ["deviceSwitchTransition", "Preview device transition"],
          ].map(([key, label]) => (
            <label className="card-ui-toggle" htmlFor={`card-ui-${key}`} key={key}>
              <input id={`card-ui-${key}`} type="checkbox" checked={settings[key]} onChange={(event) => setValue(key, event.target.checked)} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </details>
    </fieldset>
  );
}

function GuravvaProfilePopover({ onClose, copy, defaultProfile, cardUISettings, onCardUIChange, onCardUIReset, themeMode }) {
  const [profile, setProfile] = useState(() => readSavedProfile(defaultProfile));
  const [draft, setDraft] = useState(profile);
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState("");
  const firstInputRef = useRef(null);
  const editButtonRef = useRef(null);

  useEffect(() => {
    if (editing) firstInputRef.current?.focus();
    else if (feedback === copy.saved) editButtonRef.current?.focus();
  }, [editing, feedback, copy.saved]);

  const updateField = (field, value) => {
    if (field === "email") return;
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setFeedback("");
  };
  const startEditing = () => {
    setDraft({ ...profile, links: profile.links.map((link) => ({ ...link })) });
    setErrors({});
    setFeedback("");
    setEditing(true);
  };
  const cancelEditing = () => {
    setDraft({ ...profile, links: profile.links.map((link) => ({ ...link })) });
    setErrors({});
    setFeedback("");
    setEditing(false);
  };
  const addLink = () => setDraft((current) => ({ ...current, links: [...current.links, { label: "", url: "" }] }));
  const updateLink = (index, field, value) => setDraft((current) => ({
    ...current,
    links: current.links.map((link, linkIndex) => linkIndex === index ? { ...link, [field]: value } : link),
  }));
  const removeLink = (index) => setDraft((current) => ({
    ...current,
    links: current.links.filter((_, linkIndex) => linkIndex !== index),
  }));
  const saveProfile = (event) => {
    event.preventDefault();
    const nextErrors = {};
    const email = defaultProfile.email || draft.email.trim();
    if (email && !/^\[.*\]$/.test(email) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = copy.invalidEmail;
    ["linkedin", "github"].forEach((field) => {
      const value = draft[field].trim();
      if (value && !/^\[.*\]$/.test(value) && !externalProfileUrl(value)) nextErrors[field] = copy.invalidUrl;
    });
    draft.links.forEach((link, index) => {
      const label = link.label.trim();
      const url = link.url.trim();
      if (Boolean(label) !== Boolean(url)) nextErrors[`link-${index}`] = copy.linkPairRequired;
      else if (url && !externalProfileUrl(url)) nextErrors[`link-${index}`] = copy.invalidUrl;
    });
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setFeedback(copy.correctFields);
      return;
    }
    const savedProfile = {
      ...draft,
      name: draft.name.trim(),
      age: draft.age.trim(),
      mobile: draft.mobile.trim(),
      email,
      linkedin: draft.linkedin.trim(),
      github: draft.github.trim(),
      links: draft.links.map(({ label, url }) => ({ label: label.trim(), url: url.trim() })).filter((link) => link.label && link.url),
    };
    try {
      window.sessionStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(savedProfile));
    } catch (error) {
      console.error("Unable to save profile in this browser session.", error);
      setFeedback(copy.saveFailed);
      return;
    }
    setProfile(savedProfile);
    setDraft(savedProfile);
    setErrors({});
    setFeedback(copy.saved);
    setEditing(false);
  };

  const profileFields = [
    { field: "name", type: "text", ref: firstInputRef },
    { field: "age", type: "text" },
    { field: "mobile", type: "tel" },
    { field: "email", type: "email", readOnly: true },
    { field: "linkedin", type: "text" },
    { field: "github", type: "text" },
  ];
  const profileRows = [
    { field: "age", value: profile.age, href: "" },
    { field: "mobile", value: profile.mobile, href: profile.mobile ? `tel:${profile.mobile.replace(/[^\d+]/g, "")}` : "" },
    { field: "email", value: profile.email, href: profile.email.includes("@") ? `mailto:${profile.email}` : "" },
    { field: "linkedin", value: profile.linkedin, href: externalProfileUrl(profile.linkedin) },
    { field: "github", value: profile.github, href: externalProfileUrl(profile.github) },
  ];

  return (
    <section className="profile-popover" id="guravva-profile" role="dialog" aria-labelledby="guravva-profile-title" aria-describedby="profile-status">
      <div className="profile-popover-heading">
        <div>
          <p className="profile-popover-eyebrow">{copy.eyebrow}</p>
          <h2 id="guravva-profile-title">{editing ? copy.editTitle : profile.name}</h2>
        </div>
        {!editing && (
          <div className="profile-view-actions">
            <button ref={editButtonRef} className="profile-edit-button" type="button" onClick={startEditing}>
              <ProfileIcon name="edit" /> {copy.edit}
            </button>
            <button className="profile-popover-close" type="button" aria-label={copy.close} onClick={onClose}>×</button>
          </div>
        )}
        {editing && <button className="profile-popover-close" type="button" aria-label={copy.close} onClick={onClose}>×</button>}
      </div>
      {!editing ? (
        <>
          <dl className="profile-details">
            {profileRows.map(({ field, value, href }) => (
              <div key={field}>
                <dt>{copy.labels[field]}</dt>
                <dd>{href ? <a href={href} aria-label={copy.labels[field]} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>{value || copy.placeholders[field]}</a> : value || copy.placeholders[field]}</dd>
              </div>
            ))}
            {profile.links.map(({ label, url }, index) => (
              <div key={`${label}-${index}`}>
                <dt>{label}</dt>
                <dd><a href={externalProfileUrl(url)} aria-label={label} title={url} target="_blank" rel="noreferrer">{label}</a></dd>
              </div>
            ))}
          </dl>
          {profile.links.length === 0 && <p className="profile-empty-links">{copy.noLinks}</p>}
        </>
      ) : (
        <form className="profile-form" onSubmit={saveProfile} noValidate>
          <div className="profile-form-grid">
            {profileFields.map(({ field, type, ref }) => {
              const id = `profile-${field}`;
              return (
                <div className="profile-field" key={field}>
                  <label htmlFor={id}>{copy.formLabels[field]}</label>
                  <input
                    ref={ref}
                    id={id}
                    name={field}
                    type={type}
                    value={draft[field]}
                    readOnly={field === "email"}
                    onChange={(event) => updateField(field, event.target.value)}
                    aria-invalid={Boolean(errors[field])}
                    aria-describedby={errors[field] ? `${id}-error` : undefined}
                    autoComplete="off"
                  />
                  {errors[field] && <span className="profile-field-error" id={`${id}-error`}>{errors[field]}</span>}
                </div>
              );
            })}
          </div>
          <fieldset className="profile-custom-links">
            <legend>{copy.customLinks}</legend>
            {draft.links.map((link, index) => (
              <div className="profile-custom-link-row" key={index}>
                <div className="profile-field">
                  <label htmlFor={`custom-link-label-${index}`}>{copy.linkLabel}</label>
                  <input id={`custom-link-label-${index}`} value={link.label} onChange={(event) => updateLink(index, "label", event.target.value)} />
                </div>
                <div className="profile-field">
                  <label htmlFor={`custom-link-url-${index}`}>{copy.linkUrl}</label>
                  <input id={`custom-link-url-${index}`} type="text" value={link.url} onChange={(event) => updateLink(index, "url", event.target.value)} aria-invalid={Boolean(errors[`link-${index}`])} aria-describedby={errors[`link-${index}`] ? `custom-link-error-${index}` : undefined} />
                </div>
                <button className="profile-remove-link" type="button" aria-label={copy.removeLink.replace("{number}", String(index + 1))} onClick={() => removeLink(index)}>
                  <ProfileIcon name="remove" />
                </button>
                {errors[`link-${index}`] && <span className="profile-field-error profile-link-error" id={`custom-link-error-${index}`}>{errors[`link-${index}`]}</span>}
              </div>
            ))}
            {draft.links.length === 0 && <p className="profile-empty-links">{copy.emptyLinks}</p>}
            <button className="profile-add-link" type="button" onClick={addLink}><ProfileIcon name="plus" /> {copy.addLink}</button>
          </fieldset>
          <CardUISettings settings={cardUISettings} onChange={onCardUIChange} onReset={onCardUIReset} themeMode={themeMode} />
          <div className="profile-form-actions">
            <button className="profile-save-button" type="submit"><ProfileIcon name="save" /> {copy.save}</button>
            <button className="profile-cancel-button" type="button" onClick={cancelEditing}>{copy.cancel}</button>
          </div>
        </form>
      )}
      <p className="profile-status" id="profile-status" aria-live="polite">{feedback}</p>
    </section>
  );
}

function SiteNav({ isDetail, onHome, onCertificate, themeMode, onCycleTheme, site, navigation, certificateRoute, profile, cardUISettings, onCardUIChange, onCardUIReset }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const navRef = useRef(null);
  const profileTriggerRef = useRef(null);
  const copy = site.navigation;
  const profileCopy = site.profile;
  const projectsLink = navigation.find((item) => item.slot === "projects");
  const certificateLink = navigation.find((item) => item.slot === "certificate");
  const contactLink = navigation.find((item) => item.slot === "contact");
  const nextTheme = themeMode === "dark" ? "light" : "dark";

  useEffect(() => {
    if (!profileOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
        profileTriggerRef.current?.focus();
      }
    };
    const closeOnOutsideClick = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) setProfileOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsideClick);
    };
  }, [profileOpen]);

  const projectHref = isDetail ? "/" : projectsLink.href.replace(/^\/#/, "#");
  return (
    <nav className="navbar portfolio-nav">
      <div className="container d-flex justify-content-between align-items-center" ref={navRef}>
        <div className="portfolio-brand">
          <button
            className="brand-mark"
            ref={profileTriggerRef}
            type="button"
            aria-label={copy.profileAria}
            aria-expanded={profileOpen}
            aria-controls={profileOpen ? "guravva-profile" : undefined}
            title={copy.profileAria}
            onClick={() => setProfileOpen((open) => !open)}
          >
            {copy.profileInitial}
          </button>
          <a href="/" onClick={onHome}>{site.brand.prefix}<span className="brand-dot">{site.brand.separator}</span>{site.brand.suffix}</a>
          {profileOpen && <GuravvaProfilePopover onClose={() => setProfileOpen(false)} copy={profileCopy} defaultProfile={profile} cardUISettings={cardUISettings} onCardUIChange={onCardUIChange} onCardUIReset={onCardUIReset} themeMode={themeMode} />}
        </div>
        <div className="nav-controls d-flex align-items-center gap-2 gap-md-4">
          <div className="navbar-text-controls">
            <a
              className="nav-link portfolio-nav-link navbar-text-control"
              href={certificateRoute}
              onClick={onCertificate}
              title={copy.certificateTitle}
              aria-label={copy.certificateAria}
            >
              {certificateLink.label}
            </a>
            <a className="nav-link portfolio-nav-link navbar-text-control" href={projectHref} onClick={isDetail ? onHome : undefined} aria-label={copy.projectsAria} title={copy.projectsAria}>
              {projectsLink.label}
            </a>
          </div>
          {!isDetail && (
            <a className="btn btn-dark rounded-pill px-3 px-md-4 nav-contact" href={contactLink.href}>
              {contactLink.label} <span aria-hidden="true">↗</span>
            </a>
          )}
          <button
            type="button"
            className="theme-toggle btn theme-toggle-icon"
            onClick={onCycleTheme}
            aria-label={copy.switchTheme.replace("{theme}", copy.themeNames[nextTheme])}
            aria-pressed={themeMode === "dark"}
            title={copy.switchTheme.replace("{theme}", copy.themeNames[nextTheme])}
          >
            <span className="theme-toggle-track" aria-hidden="true">
              <span className="theme-toggle-thumb"><NavIcon name={themeMode === "dark" ? "moon" : "sun"} /></span>
            </span>
            <span className="visually-hidden">{copy.modeLabels[themeMode]}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

function PortfolioHome({
  projects, totalProjects, categories, site, navigation, certificate, profile, onOpen, onCertificate,
  themeMode, onCycleTheme, settings, onCardUIChange, onCardUIReset, searchTerm, onSearchTermChange, activeCategory, onCategoryChange,
}) {
  const copy = site.home;
  const visibleProjects = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesCategory = activeCategory === copy.filters.all || project.categoryFilter === activeCategory;
      const searchableText = [project.title, project.description, project.category, ...project.technologies]
        .join(" ")
        .toLowerCase();
      return matchesCategory && (!query || searchableText.includes(query));
    });
  }, [projects, searchTerm, activeCategory, copy.filters.all]);
  const plural = totalProjects === 1 ? copy.projectCount.single : copy.projectCount.plural;
  const selectedCertificate = certificate;
  const certificateRoute = selectedCertificate.route;

  return (
    <div className={`portfolio-home theme-${themeMode === "dark" ? "dark" : "light"}`} id="top">
      <SiteNav site={site} navigation={navigation} certificateRoute={certificateRoute} profile={profile} onCertificate={(event) => onCertificate(event, certificateRoute)} themeMode={themeMode} onCycleTheme={onCycleTheme} cardUISettings={settings.cardUI} onCardUIChange={onCardUIChange} onCardUIReset={onCardUIReset} />
      <main>
        <section className="hero-section">
          <div className="container">
            <div className="row align-items-center g-5">
              <div className="col-12 col-lg-7">
                <p className="eyebrow"><span className="availability-dot" /> {copy.hero.eyebrow}</p>
                <h1 className="hero-title">{copy.hero.title}<br /><span>{copy.hero.titleAccent}</span></h1>
                <p className="hero-description">{copy.hero.description}</p>
                <a className="btn btn-dark rounded-pill hero-cta" href="#projects">{copy.hero.action} <span aria-hidden="true">↓</span></a>
              </div>
              <div className="col-12 col-lg-5">
                <div className="hero-art" aria-label={copy.hero.countAria.replace("{count}", String(totalProjects)).replace("{label}", plural)}>
                  <div className="hero-art-orbit orbit-one" />
                  <div className="hero-art-orbit orbit-two" />
                  <div className="hero-art-card art-card-back"><span>{copy.hero.backCard}</span><span>↗</span></div>
                  <div className="hero-art-card art-card-front">
                    <span className="art-card-kicker">{copy.hero.kicker}</span>
                    <span className="art-card-number">{String(totalProjects).padStart(2, "0")}</span>
                    <span className="art-card-caption">{copy.hero.caption}</span>
                    <span className="art-card-star">✳</span>
                  </div>
                  <span className="hero-art-note note-top">{copy.hero.note}</span>
                  <span className="hero-art-note note-bottom">{copy.hero.footnote}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="achievement-strip" aria-label={copy.achievement.ariaLabel}>
          <div className="container">
            <div className="achievement-card">
              <div className="achievement-brand-column">
                <div className="achievement-brand-lockup">
                  <img src={selectedCertificate.assets.find(({ role }) => role === "brand")?.url || ""} alt={selectedCertificate.assets.find(({ role }) => role === "brand")?.alt_text || ""} className="nxtwave-logo" />
                </div>
                <span className="achievement-kicker">{copy.achievement.kicker}</span>
              </div>
              <div className="achievement-copy">
                <p className="eyebrow mb-2"><span className="achievement-check">✓</span> {selectedCertificate.courseTitle}</p>
                <h2 id="responsive-web-achievement-title">{copy.achievement.title} <span>{copy.achievement.titleAccent}</span></h2>
                <p>{selectedCertificate.topics.map(({ label }) => label).join(", ")}</p>
              </div>
              <div className="achievement-proof">
                <strong>{totalProjects}</strong>
                <span>{plural} {copy.achievement.countDescription}</span>
                <div className="performance-badge" aria-label={copy.achievement.performanceAria}>
                  <span className="performance-badge-label">{copy.achievement.performanceLabel}</span>
                  <div className="performance-badge-main">
                    <strong>{selectedCertificate.performance?.find(({ key }) => key === "grade")?.value}</strong>
                    <div>
                      <b>{selectedCertificate.performance?.find(({ key }) => key === "percentage")?.value}</b>
                      <span>{selectedCertificate.performance?.find(({ key }) => key === "score")?.value?.replace("/", " / ")} {copy.achievement.scoreSuffix}</span>
                    </div>
                  </div>
                  <span className="performance-badge-points">{selectedCertificate.performance?.find(({ key }) => key === "gradePoints")?.value} {copy.achievement.pointsSuffix}</span>
                </div>
                <a href={certificateRoute} onClick={(event) => onCertificate(event, certificateRoute)} className="btn btn-dark rounded-pill">
                  {copy.achievement.certificateAction} <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="projects-section" id="projects">
          <div className="container">
            <div className="section-heading d-flex flex-column flex-md-row justify-content-between align-items-md-end">
              <div>
                <p className="eyebrow mb-2">{copy.projects.eyebrow.replace("{start}", "01").replace("{end}", String(totalProjects).padStart(2, "0"))}</p>
                <h2 className="section-title mb-0">{copy.projects.title}<span className="brand-dot">{site.brand.separator}</span></h2>
              </div>
              <p className="section-note mb-0 mt-3 mt-md-0">{copy.projects.note}</p>
            </div>
            <div className="project-filters d-flex flex-column flex-md-row gap-3 mb-4">
              <label className="visually-hidden" htmlFor="project-search">{copy.filters.searchLabel}</label>
              <input id="project-search" className="form-control project-search" type="search" placeholder={copy.filters.searchPlaceholder} value={searchTerm} onChange={(event) => onSearchTermChange(event.target.value)} />
              <label className="visually-hidden" htmlFor="project-category">{copy.filters.categoryLabel}</label>
              <select id="project-category" className="form-select project-category-select" value={activeCategory} onChange={(event) => onCategoryChange(event.target.value)}>
                <option value={copy.filters.all}>{copy.filters.all}</option>
                {categories.map((category) => <option key={category.slug} value={category.label}>{category.label}</option>)}
              </select>
            </div>
            <div className="row g-4 project-grid">
              {visibleProjects.map((project) => (
                <ProjectCard key={project.id} project={project} onOpen={onOpen} settings={settings} copy={copy.card} />
              ))}
            </div>
            {visibleProjects.length === 0 && (
              <div className="project-empty-state text-center rounded-4 p-5">
                <h3 className="h5">{copy.empty.title}</h3>
                <p className="mb-0">{copy.empty.description}</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <footer className="portfolio-footer">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
          <a className="footer-brand" href="/">{site.brand.prefix}<span className="brand-dot">{site.brand.separator}</span>{site.brand.suffix}</a>
          <p className="mb-0">{copy.footer.note}</p>
          <a href="#top" className="back-to-top">{copy.footer.backToTop}</a>
        </div>
      </footer>
    </div>
  );
}

function DeviceToggle({ value, onChange, options, copy }) {
  return (
    <div className="device-toggle" role="group" aria-label={copy.breakpointGroup}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`device-toggle-option${value === option.id ? " active" : ""}`}
          aria-label={copy.deviceAria.replace("{label}", option.label).replace("{range}", option.range)}
          title={`${option.label} (${option.range})`}
          aria-pressed={value === option.id}
          onClick={() => onChange(option.id)}
        >
          <span>{option.label}</span>
          <small>{option.range}</small>
        </button>
      ))}
    </div>
  );
}

function ProjectPreview({ project, device, onDeviceChange, devices, copy }) {
  const [stageWidth, setStageWidth] = useState(0);
  const stageRef = useRef(null);
  const selectedDevice = devices.find((option) => option.id === device);
  const frameWidth = selectedDevice.width + selectedDevice.frameBorder * 2;
  const frameHeight = selectedDevice.height + selectedDevice.frameBorder * 2;
  const scale = stageWidth ? Math.min(1, stageWidth / frameWidth) : 1;
  const previewUrl = `${project.route}?preview=1&device=${device}`;

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const updateWidth = () => {
      const styles = window.getComputedStyle(stage);
      const horizontalPadding = Number.parseFloat(styles.paddingLeft) + Number.parseFloat(styles.paddingRight);
      setStageWidth(Math.max(0, stage.clientWidth - horizontalPadding - 16));
    };
    updateWidth();
    if (window.ResizeObserver) {
      const observer = new ResizeObserver(updateWidth);
      observer.observe(stage);
      return () => observer.disconnect();
    }
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <section className="project-preview" aria-label={copy.ariaLabel.replace("{title}", project.title)}>
      <div className="preview-toolbar d-flex flex-wrap justify-content-between align-items-center gap-3">
        <span className="preview-toolbar-label">{copy.toolbarLabel}</span>
        <DeviceToggle value={device} onChange={onDeviceChange} options={devices} copy={copy} />
      </div>
      <div className="preview-stage" ref={stageRef}>
        <div className={`device-frame-sizer device-${device}`} style={{ width: frameWidth * scale, height: frameHeight * scale }}>
          <div className={`device-frame device-${device}`} style={{ width: selectedDevice.width, height: selectedDevice.height, transform: `scale(${scale})` }}>
            <iframe key={project.id} className="preview-frame" src={previewUrl} title={copy.frameTitle.replace("{title}", project.title)} loading="lazy" style={{ width: selectedDevice.width, height: selectedDevice.height }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectDetail({ project, device, onDeviceChange, onOpen, onBack, site, navigation, certificate, profile, themeMode, onCycleTheme, devices, cardUISettings, onCardUIChange, onCardUIReset}) {
  const copy = site.detail;
  const previewUrl = `${project.route}?preview=1&device=${device}`;
  return (
    <div className={`project-detail-page theme-${themeMode === "dark" ? "dark" : "light"}`}>
      <SiteNav isDetail site={site} navigation={navigation} certificateRoute={certificate.route} profile={profile} onHome={onOpen} onCertificate={(event) => onOpen(event, certificate.route)} themeMode={themeMode} onCycleTheme={onCycleTheme} cardUISettings={cardUISettings} onCardUIChange={onCardUIChange} onCardUIReset={onCardUIReset} />
      <main className="container detail-container">
        <>
          <a className="detail-back-link" href="/" onClick={onBack}>{copy.back}</a>
          <div className="detail-heading row align-items-end g-3">
            <div className="col-12 col-md-8">
              <p className="eyebrow mb-2">{project.category}</p>
              <h1 className="detail-title">{project.title}</h1>
              <p className="detail-description mb-3">{project.description}</p>
              <ul className="detail-tech-list list-unstyled d-flex flex-wrap gap-2 mb-0" aria-label={copy.technologiesAria}>
                {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
              </ul>
            </div>
            <div className="col-12 col-md-4 text-md-end detail-metadata-column">
              <div className="detail-meta-actions">
                <span className="detail-index">{copy.projectIndex.replace("{index}", String(project.sortOrder).padStart(2, "0"))}</span>
                <a className="btn btn-outline-dark btn-sm rounded-pill" href={previewUrl} onClick={(event) => onOpen(event, previewUrl)}>{copy.openProject} ↗</a>
              </div>
            </div>
          </div>
        </>
        <ProjectPreview key={project.id} project={project} device={device} onDeviceChange={onDeviceChange} devices={devices} copy={site.preview} />
      </main>
      <footer className="detail-footer">
        <div className="container d-flex justify-content-between align-items-center">
          <span>{site.brand.prefix}<span className="brand-dot">{site.brand.separator}</span>{site.brand.suffix}</span>
          <a href="/" onClick={onBack}>{copy.exploreMore} ↗</a>
        </div>
      </footer>
    </div>
  );
}

function App() {
  const { data, error, isLoading, isStale, retry } = usePortfolioData();
  const { settings, updateSettings, updateCardUISettings, resetCardUISettings } = useTheme();
  const site = data?.settings;
  const [route, setRoute] = useState(() => `${window.location.pathname}${window.location.search}`);
  const [previewDevice, setPreviewDevice] = useState(() => new URLSearchParams(window.location.search).get("device") || "");
  const [homeViewState, setHomeViewState] = useState({ searchTerm: "", activeCategory: "" });
  const pendingScrollRestoreRef = useRef(null);
  const pathname = route.split(/[?#]/, 1)[0];
  const projects = data?.projects || [];
  const devices = data?.devices || [];
  const certificate = data?.certificates?.find((item) => pathname === item.route) || data?.certificates?.[0];
  const selectedProject = projects.find((project) => pathname === project.route);
  const isCertificatePage = data?.certificates?.some((item) => pathname === item.route);
  const isProjectPreview = Boolean(selectedProject && new URLSearchParams(route.split("?")[1] || "").has("preview"));
  const activeDevice = devices.find((option) => option.id === previewDevice)?.id || devices.find((option) => option.id === "extra-large")?.id || devices[0]?.id;
  const defaultProfile = data?.settings?.profile?.defaultValues || {};

  useEffect(() => {
    const handlePopState = (event) => {
      const nextRoute = `${window.location.pathname}${window.location.search}`;
      pendingScrollRestoreRef.current = { route: nextRoute, scrollY: Number(event.state?.appScrollY) || 0 };
      setRoute(nextRoute);
      const requestedDevice = new URLSearchParams(window.location.search).get("device");
      setPreviewDevice(requestedDevice || "");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const pendingRestore = pendingScrollRestoreRef.current;
    const scrollY = pendingRestore?.route === route ? pendingRestore.scrollY : 0;
    pendingScrollRestoreRef.current = null;
    window.scrollTo(0, scrollY);
  }, [route]);

  useEffect(() => {
    if (!selectedProject || !isProjectPreview || window.self !== window.top || window.history.state?.appRoute) return;
    const detailPath = selectedProject.route;
    const previewLocation = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    window.history.replaceState({ appRoute: true, appScrollY: 0 }, "", detailPath);
    window.history.pushState({ appRoute: true, appRoutePreviousPath: detailPath, appScrollY: 0 }, "", previewLocation);
  }, [isProjectPreview, selectedProject]);

  useEffect(() => {
    document.documentElement.style.colorScheme = settings.mode === "dark" ? "dark" : "light";
  }, [settings.mode]);

  useEffect(() => {
    if (!site?.imageFallback) return undefined;
    return attachImageFallbacks(site.imageFallback);
  }, [site?.imageFallback]);

  const navigate = (event, destination) => {
    if (event && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)) return;
    if (event) event.preventDefault();
    let destinationUrl;
    try {
      destinationUrl = new URL(destination, window.location.href);
    } catch {
      return;
    }
    if (destinationUrl.origin !== window.location.origin) return;
    const currentRoute = `${window.location.pathname}${window.location.search}`;
    const nextRoute = `${destinationUrl.pathname}${destinationUrl.search}`;
    if (`${currentRoute}${window.location.hash}` !== `${nextRoute}${destinationUrl.hash}`) {
      const updateRoute = () => {
        flushSync(() => {
          const currentState = window.history.state && typeof window.history.state === "object" ? window.history.state : {};
          window.history.replaceState({ ...currentState, appRoute: true, appScrollY: window.scrollY }, "", window.location.href);
          window.history.pushState({ appRoute: true, appRoutePreviousPath: currentRoute, appScrollY: 0 }, "", destinationUrl.href);
          pendingScrollRestoreRef.current = null;
          setRoute(nextRoute);
        });
      };
      if (document.startViewTransition) document.startViewTransition(updateRoute);
      else updateRoute();
    }
  };

  const navigateBack = (event, fallbackDestination) => {
    if (event && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)) return;
    if (event) event.preventDefault();
    let destinationUrl;
    try {
      destinationUrl = new URL(fallbackDestination, window.location.href);
    } catch {
      return;
    }
    if (destinationUrl.origin !== window.location.origin) return;
    const nextRoute = `${destinationUrl.pathname}${destinationUrl.search}`;
    window.history.replaceState({ appRoute: true, appScrollY: 0 }, "", destinationUrl.href);
    pendingScrollRestoreRef.current = { route: nextRoute, scrollY: 0 };
    setRoute(nextRoute);
  };

  if (!data) {
    return (
      <main className="portfolio-data-state" role={error ? "alert" : "status"}>
        {error ? <><p>{error}</p><button type="button" onClick={retry} aria-label={error} title={error}>↻</button></> : null}
      </main>
    );
  }

  const appStatus = site.status;
  if (isLoading && !data.projects.length) return <main className="portfolio-data-state" role="status" aria-label={appStatus.loadingLabel} />;
  if (!certificate || !devices.length) {
    return <main className="portfolio-data-state" role="alert"><p>{appStatus.dataUnavailable}</p><button type="button" onClick={retry}>{appStatus.retry}</button></main>;
  }
  const viewError = error ? (
    <div className="portfolio-data-warning" role="status" data-stale={String(isStale)}>
      <span>{error}</span>
      <button type="button" onClick={retry}>{appStatus.retry}</button>
    </div>
  ) : null;

  if (selectedProject && isProjectPreview) {
    const Project = projectComponents[selectedProject.slug];
    const requestedDevice = new URLSearchParams(route.split("?")[1] || "").get("device");
    const device = devices.some((option) => option.id === requestedDevice) ? requestedDevice : devices[0]?.id;
    const preview = Project
      ? <Project data={selectedProject.data} device={device} />
      : <DatabaseProjectPreview project={selectedProject} />;
    return <>{viewError}{window.self === window.top ? <div className={`standalone-project-preview standalone-project-preview--${selectedProject.id}`}><button type="button" className="standalone-preview-back" onClick={(event) => navigateBack(event, selectedProject.route)}><span aria-hidden="true">←</span>{appStatus.back}</button>{preview}</div> : preview}</>;
  }

  const homeRoute = data.navigation.find(({ slot }) => slot === "projects")?.href || "/";
  const certificatePage = isCertificatePage && certificate ? (
    <div className={`project-detail-page theme-${settings.mode === "dark" ? "dark" : "light"}`}>
      <SiteNav isDetail site={site} navigation={data.navigation} certificateRoute={certificate.route} profile={defaultProfile} onHome={(event) => navigate(event, homeRoute)} onCertificate={(event) => navigate(event, certificate.route)} themeMode={settings.mode} onCycleTheme={() => updateSettings({ mode: settings.mode === "dark" ? "light" : "dark" })} cardUISettings={settings.cardUI} onCardUIChange={updateCardUISettings} onCardUIReset={resetCardUISettings} />
      <CertificateShowcase data={certificate} copy={site.certificate} onBack={(event) => navigate(event, homeRoute)} />
      <footer className="detail-footer">
        <div className="container d-flex justify-content-between align-items-center">
          <span>{site.brand.prefix}<span className="brand-dot">{site.brand.separator}</span>{site.brand.suffix}</span>
          <a href={homeRoute} onClick={(event) => navigate(event, homeRoute)}>{site.detail.backToProjects}</a>
        </div>
      </footer>
    </div>
  ) : selectedProject ? (
    <ProjectDetail
      project={selectedProject}
      device={activeDevice}
      onDeviceChange={setPreviewDevice}
      onOpen={(event, destination = homeRoute) => navigate(event, destination)}
      onBack={(event) => navigateBack(event, homeRoute)}
      site={site}
      navigation={data.navigation}
      certificate={certificate}
      profile={defaultProfile}
      themeMode={settings.mode}
      onCycleTheme={() => updateSettings({ mode: settings.mode === "dark" ? "light" : "dark" })}
      cardUISettings={settings.cardUI}
      onCardUIChange={updateCardUISettings}
      onCardUIReset={resetCardUISettings}
      devices={devices}
    />
  ) : (
    <PortfolioHome
      projects={projects}
      totalProjects={data.totalProjects}
      categories={data.categories}
      site={site}
      navigation={data.navigation}
      certificate={certificate}
      profile={defaultProfile}
      onOpen={(event, id) => navigate(event, projects.find((project) => project.id === id)?.route || homeRoute)}
      onCertificate={(event, destination) => navigate(event, destination)}
      themeMode={settings.mode}
      onCycleTheme={() => updateSettings({ mode: settings.mode === "dark" ? "light" : "dark" })}
      onCardUIChange={updateCardUISettings}
      onCardUIReset={resetCardUISettings}
      settings={settings}
      searchTerm={homeViewState.searchTerm}
      onSearchTermChange={(searchTerm) => setHomeViewState((current) => ({ ...current, searchTerm }))}
      activeCategory={homeViewState.activeCategory || site.home.filters.all}
      onCategoryChange={(activeCategory) => setHomeViewState((current) => ({ ...current, activeCategory }))}
    />
  );

  return <>{viewError}{certificatePage}</>;
}

export default App;
