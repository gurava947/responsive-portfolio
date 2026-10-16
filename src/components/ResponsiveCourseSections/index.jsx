import { useEffect, useRef, useState } from "react";
import "./index.css";

function AssetImage({ src, alt = "", className = "", loading = "lazy" }) {
  if (!src) return null;
  return <img className={className} src={src} alt={alt} loading={loading} decoding="async" />;
}

function SectionHeading({ title, subtitle, className = "", titleId }) {
  return (
    <header className={`rcs-heading ${className}`}>
      <h1 id={titleId}>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </header>
  );
}

export function ResponsiveFeaturesSection({ data = {} }) {
  const items = Array.isArray(data.items) ? data.items : [];
  return (
    <main className="rcs-preview rcs-features">
      <section className="rcs-container rcs-features-inner" aria-labelledby="rcs-features-title">
        <SectionHeading className="rcs-centered-heading" titleId="rcs-features-title" title={data.title || "Features that make Design simply awesome"} subtitle={data.subtitle} />
        <div className="rcs-features-grid">
          {items.map((item) => (
            <article className="rcs-feature-item" key={item.title}>
              <div className="rcs-feature-icon"><AssetImage src={item.image} alt="" /></div>
              <div><h2>{item.title}</h2><p>{item.description}</p></div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export function DesignToolsSection({ data = {} }) {
  const features = Array.isArray(data.features) ? data.features : [];
  return (
    <main className="rcs-preview rcs-tools">
      <section className="rcs-container rcs-tools-inner" aria-label={data.ariaLabel || "Design tools"}>
        {features.map((feature, index) => (
          <article className={`rcs-tool-row${index % 2 ? " rcs-tool-row-reverse" : ""}`} key={feature.title}>
            <AssetImage className="rcs-tool-image" src={feature.image} alt={feature.imageAlt || ""} />
            <div className="rcs-tool-copy"><h1>{feature.title}</h1><p>{feature.description}</p></div>
          </article>
        ))}
      </section>
    </main>
  );
}

export function DesignDeliverSection({ data = {} }) {
  const features = Array.isArray(data.features) ? data.features : [];
  return (
    <main className="rcs-preview rcs-design-deliver">
      <section className="rcs-container rcs-deliver-grid" aria-label={data.ariaLabel || "Design and deliver"}>
        {features.map((feature) => (
          <article className="rcs-deliver-item" key={feature.title}>
            <AssetImage src={feature.image} alt={feature.imageAlt || ""} />
            <h1>{feature.title}</h1>
            <p>{feature.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

export function LogosSection({ data = {} }) {
  const logos = Array.isArray(data.logos) ? data.logos : [];
  return (
    <main className="rcs-preview rcs-logos">
      <section className="rcs-container rcs-logos-inner" aria-labelledby="rcs-logos-title">
        <h1 id="rcs-logos-title">{data.title || "Used by and seen on"}</h1>
        <div className="rcs-logos-grid">
          {logos.map((logo) => <AssetImage key={logo.name} src={logo.image} alt={logo.alt || logo.name} />)}
        </div>
      </section>
    </main>
  );
}

export function DesignToolNavbarBanner({ data = {} }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = Array.isArray(data.navigationLinks) ? data.navigationLinks : [];
  return (
    <main className="rcs-preview rcs-design-landing" id="design-home">
      <header className="rcs-design-nav">
        <div className="rcs-design-nav-inner">
          <a className="rcs-design-brand" href="#design-home" aria-label={data.logoAlt || "Design home"}>
            <AssetImage src={data.logoUrl} alt={data.logoAlt || "Design"} loading="eager" />
          </a>
          <button className="rcs-design-menu-button" type="button" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen} aria-controls="rcs-design-navigation" onClick={() => setMenuOpen((open) => !open)}>
            <span /><span /><span />
          </button>
          <nav id="rcs-design-navigation" className={`rcs-design-navigation${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">
            {links.map((link) => <a key={link.label} href={link.href || "#design-home"} onClick={() => setMenuOpen(false)}>{link.label}</a>)}
          </nav>
        </div>
      </header>
      <section className="rcs-design-hero" style={{ backgroundImage: `url("${data.backgroundImage || ""}")` }}>
        <div className="rcs-design-hero-copy">
          <h1>{data.headline}</h1>
          <p>{data.description}</p>
          <a className="rcs-design-signup" href={data.ctaHref || "#design-home"}>{data.ctaLabel || "Sign Up"}</a>
        </div>
      </section>
    </main>
  );
}

function SocialMark({ glyph, label }) {
  return <a className="rcs-social-mark" href="#ecommerce-footer" aria-label={label}><span aria-hidden="true">{glyph}</span></a>;
}

export function EcommerceFooterSection({ data = {} }) {
  const columns = Array.isArray(data.columns) ? data.columns : [];
  const socials = Array.isArray(data.socialLinks) ? data.socialLinks : [];
  return (
    <main className="rcs-preview rcs-ecommerce-footer" id="ecommerce-footer">
      <footer className="rcs-container rcs-footer-inner">
        <section className="rcs-footer-brand" aria-label={data.brandLabel || "Fly Buy contact information"}>
          <AssetImage className="rcs-footer-logo" src={data.logoUrl} alt={data.logoAlt || "Fly Buy"} loading="eager" />
          <div className="rcs-social-row">{socials.map((item) => <SocialMark key={item.label} glyph={item.glyph} label={item.label} />)}</div>
          <p className="rcs-footer-address">{data.address}</p>
        </section>
        {columns.map((column) => (
          <section className="rcs-footer-column" key={column.title}>
            <h2>{column.title}</h2>
            <ul>{(column.links || []).map((link) => <li key={link.label}><a href={link.href || "#ecommerce-footer"}>{link.label}</a></li>)}</ul>
          </section>
        ))}
        <p className="rcs-footer-copyright">{data.copyright}</p>
      </footer>
    </main>
  );
}

export function EcommerceContactUsSection({ data = {} }) {
  return (
    <main className="rcs-preview rcs-ecommerce-contact" id="ecommerce-contact">
      <section className="rcs-contact-inner" aria-labelledby="rcs-contact-title">
        <h1 id="rcs-contact-title">{data.title || "Let us Join Together"}</h1>
        <a className="rcs-contact-button" href={data.href || "#ecommerce-contact"}>{data.buttonLabel || "CONTACT US"}</a>
      </section>
    </main>
  );
}

function ProductGrid({ items = [] }) {
  return <div className="rcs-product-grid">{items.map((item) => (
    <article className="rcs-mini-product" key={item.title}>
      <AssetImage src={item.image} alt={item.alt || item.title} />
      <h3>{item.title}</h3>
    </article>
  ))}</div>;
}

export function EcommerceExploreSection({ data = {} }) {
  const cards = Array.isArray(data.cards) ? data.cards : [];
  return (
    <main className="rcs-preview rcs-ecommerce-explore" id="ecommerce-explore">
      <section className="rcs-container rcs-explore-inner" aria-labelledby="rcs-explore-title">
        <h1 id="rcs-explore-title">{data.title || "Explore Deals & Offers"}</h1>
        <div className="rcs-explore-grid">
          {cards.map((card) => (
            <article className={`rcs-explore-card${card.kind === "hero" ? " rcs-explore-card-hero" : ""}`} key={card.title}>
              <h2>{card.title}</h2>
              {card.items ? <ProductGrid items={card.items} /> : <AssetImage className="rcs-explore-hero-image" src={card.image} alt={card.imageAlt || card.title} />}
              <a href={card.href || "#ecommerce-explore"}>{card.linkLabel || "See All Deals"} <span aria-hidden="true">→</span></a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export function EcommerceTrendingBlogsSection({ data = {} }) {
  const blogs = Array.isArray(data.blogs) ? data.blogs : [];
  return (
    <main className="rcs-preview rcs-trending-blogs" id="ecommerce-blogs">
      <section className="rcs-container rcs-blogs-inner" aria-labelledby="rcs-blogs-title">
        <h1 id="rcs-blogs-title">{data.title || "Trending Blogs"}</h1>
        <div className="rcs-blogs-grid">
          {blogs.map((blog) => (
            <article className="rcs-blog-card" key={blog.title}>
              <AssetImage className="rcs-blog-image" src={blog.image} alt={blog.imageAlt || ""} />
              <div className="rcs-blog-copy"><p className="rcs-blog-category">{blog.category}</p><h2>{blog.title}</h2><p className="rcs-blog-description">{blog.description}</p><a href={blog.href || "#ecommerce-blogs"}>{blog.readMoreLabel || "READ MORE"} <span aria-hidden="true">→</span></a></div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export function EcommerceOffersSection({ data = {} }) {
  return (
    <main className="rcs-preview rcs-ecommerce-offers" id="ecommerce-offers">
      <section className="rcs-offers-panel">
        <AssetImage className="rcs-offer-badge" src={data.badgeImage} alt={data.badgeAlt || "Special offer"} loading="eager" />
        <div className="rcs-offers-copy">
          <p className="rcs-offers-eyebrow">{data.eyebrow}</p><h1>{data.title}</h1>
          <AssetImage className="rcs-offers-credit" src={data.creditImage} alt={[data.discount, data.caption, data.creditAlt].filter(Boolean).join(". ") || "SBI Card"} />
        </div>
        <AssetImage className="rcs-offers-appliances" src={data.appliancesImage} alt={data.appliancesAlt || "Home appliances and electronics"} loading="eager" />
      </section>
    </main>
  );
}

function ProductDetailsModal({ product, closeLabel, buyLabel, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => {
    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = priorOverflow; window.removeEventListener("keydown", onKeyDown); };
  }, [onClose]);
  return (
    <div className="rcs-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="rcs-product-modal" role="dialog" aria-modal="true" aria-labelledby="rcs-product-modal-title">
        <button ref={closeRef} type="button" className="rcs-modal-close" aria-label={closeLabel} onClick={onClose}>×</button>
        <h2 id="rcs-product-modal-title">{product.modalTitle}</h2>
        <p>{product.modalDescription}</p>
        <ul>{(product.features || []).map((feature) => <li key={feature}><strong>{feature.split(":")[0]}:</strong>{feature.includes(":") ? feature.slice(feature.indexOf(":") + 1) : ""}</li>)}</ul>
        <button className="rcs-modal-buy" type="button">{buyLabel}</button>
      </section>
    </div>
  );
}

export function EcommerceProductsSection({ data = {} }) {
  const products = Array.isArray(data.products) ? data.products : [];
  const [selectedProduct, setSelectedProduct] = useState(null);
  return (
    <main className="rcs-preview rcs-ecommerce-products" id="ecommerce-products">
      <section className="rcs-container rcs-products-inner" aria-labelledby="rcs-products-title">
        <h1 id="rcs-products-title">{data.title || "Our Products"}</h1>
        <div className="rcs-products-grid">
          {products.map((product) => (
            <article className="rcs-product-card" key={product.id} style={{ backgroundImage: `url("${product.image || ""}")` }}>
              <div className="rcs-product-card-copy"><h2>{product.title}</h2><p>{product.description}</p><button type="button" onClick={() => setSelectedProduct(product)}>{product.viewDetailsLabel || "View Details"}</button></div>
            </article>
          ))}
        </div>
        <a className="rcs-see-offers" href={data.offersHref || "#ecommerce-offers"}>{data.offersLabel || "See All Offers"} <span aria-hidden="true">→</span></a>
      </section>
      {selectedProduct && <ProductDetailsModal product={selectedProduct} closeLabel={data.closeLabel || "Close product details"} buyLabel={data.buyLabel || "Buy Now"} onClose={() => setSelectedProduct(null)} />}
    </main>
  );
}

export function EcommerceServicesSection({ data = {} }) {
  const services = Array.isArray(data.services) ? data.services : [];
  return (
    <main className="rcs-preview rcs-ecommerce-services" id="ecommerce-services">
      <section className="rcs-container rcs-services-inner" aria-labelledby="rcs-services-title">
        <h1 id="rcs-services-title">{data.title || "Our Services"}</h1><p className="rcs-services-intro">{data.description}</p>
        <div className="rcs-services-grid">
          {services.map((service) => <article className="rcs-service-card" key={service.title}><AssetImage src={service.image} alt="" /><h2>{service.title}</h2><p>{service.description}</p></article>)}
        </div>
      </section>
    </main>
  );
}
