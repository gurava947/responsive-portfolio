import "./index.css";

const svgProps = {
  "aria-hidden": true,
  fill: "currentColor",
  viewBox: "0 0 24 24",
};

function SocialIcon({ name }) {
  if (name === "google") return <svg {...svgProps}><text x="4" y="20" fontSize="20" fontWeight="700" fontFamily="Arial, sans-serif">G</text></svg>;
  if (name === "twitter") return <svg {...svgProps}><path d="M22 5.9a8 8 0 0 1-2.35.64 4.1 4.1 0 0 0 1.8-2.26 8.2 8.2 0 0 1-2.6.99 4.08 4.08 0 0 0-7.05 2.79c0 .32.04.63.11.93A11.58 11.58 0 0 1 3.5 4.73a4.08 4.08 0 0 0 1.26 5.45 4.03 4.03 0 0 1-1.85-.51v.05a4.09 4.09 0 0 0 3.27 4 4.1 4.1 0 0 1-1.84.07 4.1 4.1 0 0 0 3.82 2.84A8.2 8.2 0 0 1 2.1 18.3a11.56 11.56 0 0 0 6.26 1.84c7.52 0 11.64-6.23 11.64-11.64l-.01-.53A8.3 8.3 0 0 0 22 5.9Z" /></svg>;
  if (name === "instagram") return <svg {...svgProps}><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.5" cy="6.8" r="1.2" /></svg>;
  if (name === "linkedin") return <svg {...svgProps}><path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM8.34 18H5.67V9.42h2.67ZM7 8.25a1.55 1.55 0 1 1 0-3.1 1.55 1.55 0 0 1 0 3.1ZM18.34 18h-2.67v-4.17c0-1-.02-2.29-1.4-2.29-1.4 0-1.61 1.09-1.61 2.22V18H10V9.42h2.56v1.17h.04a2.8 2.8 0 0 1 2.52-1.39c2.7 0 3.2 1.78 3.2 4.1Z" /></svg>;
  return null;
}

function ContactIcon({ name }) {
  if (name === "mail") return <svg {...svgProps}><path d="M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm9 7.2L21 7H3l9 5.2ZM3 17h18V9.3l-9 5.2-9-5.2V17Z" /></svg>;
  if (name === "phone") return <svg {...svgProps}><path d="M6.6 10.8a15.4 15.4 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.58.57.56 0 1 .44 1 1V20c0 .56-.44 1-1 1C10.6 21 3 13.4 3 4c0-.56.44-1 1-1h3.5c.56 0 1 .44 1 1 0 1.25.2 2.46.57 3.58a1 1 0 0 1-.24 1.02l-2.23 2.2Z" /></svg>;
  return <svg {...svgProps}><circle cx="12" cy="12" r="10" /><text x="7" y="17" fill="#19232d" fontSize="14" fontWeight="700" fontFamily="Arial, sans-serif">S</text></svg>;
}

function VrWebsiteFooterSection({ data = {} }) {
  const socialLinks = Array.isArray(data.socialLinks) ? data.socialLinks : [];
  const contactItems = Array.isArray(data.contactItems) ? data.contactItems : [];
  const helpLinks = Array.isArray(data.helpLinks) ? data.helpLinks : [];

  return (
    <main className="vr-website-footer-demo">
      <footer className="vr-footer-section">
        <div className="container-fluid px-4 px-lg-5 vr-footer-container">
          <div className="row gx-lg-5 gy-5 vr-footer-main-row">
            <section className="col-12 col-md-4 text-center text-md-left vr-footer-brand-column" aria-label="VR social links and address">
              <a className="vr-footer-logo-link" href="#home" aria-label="VR home">
                <img className="vr-footer-logo" src={data.logoUrl || "/vr-logo-img.png"} alt={data.logoAlt || "VR logo"} />
              </a>
              <div className="d-flex flex-row justify-content-center justify-content-md-start vr-footer-socials">
                {socialLinks.map((item) => (
                  <a className="vr-footer-social-link" href={item.href} key={item.icon} aria-label={item.label} title={item.label} target="_blank" rel="noreferrer">
                    <SocialIcon name={item.icon} />
                  </a>
                ))}
              </div>
              <p className="vr-footer-address text-md-left">{data.address}</p>
            </section>

            <section className="col-6 col-md-4 vr-footer-contact-column" aria-labelledby="vr-footer-contact-title">
              <h2 className="vr-footer-heading" id="vr-footer-contact-title">{data.contactHeading || "Contact Us"}</h2>
              <ul className="list-unstyled vr-footer-contact-list">
                {contactItems.map((item) => (
                  <li className="vr-footer-contact-item" key={`${item.icon}-${item.label}`}>
                    <ContactIcon name={item.icon} />
                    <a href={item.href}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </section>

            <section className="col-6 col-md-4 vr-footer-help-column" aria-labelledby="vr-footer-help-title">
              <h2 className="vr-footer-heading" id="vr-footer-help-title">{data.helpHeading || "Let Us Help You"}</h2>
              <ul className="list-unstyled vr-footer-help-list">
                {helpLinks.map((item) => (
                  <li key={item.label}><a href={item.href || "#help"}>{item.label}</a></li>
                ))}
              </ul>
            </section>
          </div>

          <hr className="vr-footer-divider" />
          <p className="vr-footer-copyright text-center mb-0">{data.copyright}</p>
        </div>
      </footer>
    </main>
  );
}

export default VrWebsiteFooterSection;
