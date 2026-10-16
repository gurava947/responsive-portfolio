import { useState } from "react";
import "./CertificateShowcase.css";

function CertificateIcon({ name, className = "certificate-action-icon" }) {
  const sharedProps = {
    "aria-hidden": true,
    className,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
  };
  const paths = {
    share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.7 10.7 6.6-4.4M8.7 13.3l6.6 4.4" /></>,
    twitter: <path d="M22 5.9a8.2 8.2 0 0 1-2.4.7 4.2 4.2 0 0 0 1.8-2.3 8.4 8.4 0 0 1-2.7 1 4.2 4.2 0 0 0-7.2 3.8 11.9 11.9 0 0 1-8.6-4.4 4.2 4.2 0 0 0 1.3 5.6 4.1 4.1 0 0 1-1.9-.5v.1a4.2 4.2 0 0 0 3.4 4.1 4.2 4.2 0 0 1-1.9.1 4.2 4.2 0 0 0 3.9 2.9A8.4 8.4 0 0 1 2.5 19a11.8 11.8 0 0 0 18.2-10c0-.2 0-.4-.1-.5A8.5 8.5 0 0 0 22 5.9Z" />,
    copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>,
    download: <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 17v3h14v-3" />,
    code: <path d="m8 7-5 5 5 5M16 7l5 5-5 5m-2-12-4 14" />,
    box: <path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5m-18 5 9 5 9-5M12 13v9" />,
    layout: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M9 9v11" /></>,
    components: <><rect x="3" y="3" width="8" height="8" rx="1.5" /><rect x="13" y="3" width="8" height="5" rx="1.5" /><rect x="13" y="10" width="8" height="11" rx="1.5" /><rect x="3" y="13" width="8" height="8" rx="1.5" /></>,
    grade: <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />,
    points: <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></>,
    score: <path d="M4 19V5m0 14h16M8 15l3-4 3 2 5-7" />,
    percentage: <><circle cx="7" cy="7" r="2.5" /><circle cx="17" cy="17" r="2.5" /><path d="m19 5-14 14" /></>,
    external: <path d="M14 4h6v6m-11 3L20 4M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />,
  };
  return <svg {...sharedProps}>{paths[name] || paths.external}</svg>;
}

function CertificateActions({ data, copy }) {
  const [copyStatus, setCopyStatus] = useState("");

  const handleCopy = async () => {
    try {
      if (!navigator.clipboard || typeof navigator.clipboard.writeText !== "function") {
        throw new Error(copy.clipboardUnavailable);
      }
      await navigator.clipboard.writeText(data.certificateUrl);
      setCopyStatus(copy.copied);
    } catch (clipboardError) {
      try {
        const field = document.createElement("textarea");
        field.value = data.certificateUrl;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        const copied = document.execCommand("copy");
        field.remove();
        if (!copied) throw new Error(copy.copyDenied);
        setCopyStatus(copy.copied);
      } catch (fallbackError) {
        setCopyStatus(copy.copyFailed.replace("{error}", fallbackError.message || clipboardError.message));
      }
    }
  };

  const handleShare = async () => {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: data.courseTitle, url: data.certificateUrl });
        return;
      } catch (error) {
        if (error.name === "AbortError") return;
      }
    }
    await handleCopy();
  };

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(data.shareMessage)}&url=${encodeURIComponent(data.certificateUrl)}`;

  return (
    <div className="certificate-actions" aria-label={copy.actionsAria}>
      <a className="certificate-action certificate-action-primary" href={data.certificatePdfUrl} target="_blank" rel="noreferrer" aria-label={copy.download} title={copy.download}>
        <CertificateIcon name="download" />
        <span>{copy.download}</span>
      </a>
      <button className="certificate-action" type="button" onClick={handleShare} aria-label={copy.shareAria} title={copy.shareAria}>
        <CertificateIcon name="share" />
        <span>{copy.share}</span>
      </button>
      <a className="certificate-action" href={tweetUrl} target="_blank" rel="noreferrer" aria-label={copy.shareOnTwitter} title={copy.shareOnTwitter}>
        <CertificateIcon name="twitter" />
        <span>{copy.twitter}</span>
      </a>
      <button className="certificate-action" type="button" onClick={handleCopy} aria-label={copy.copyAria} title={copy.copyAria}>
        <CertificateIcon name="copy" />
        <span>{copyStatus === copy.copied ? copy.copied : copy.copy}</span>
      </button>
      <p className="certificate-action-status" role="status" aria-live="polite">{copyStatus}</p>
    </div>
  );
}

function CertificateHeader({ data, copy, onBack }) {
  const image = data.assets.find(({ role }) => role === "certificate");
  return (
    <header className="certificate-header certificate-surface">
      <div className="certificate-header-copy">
        <a className="certificate-back-link" href="/" onClick={onBack}>
          <span aria-hidden="true">←</span>
          <span>{copy.back}</span>
        </a>
        <p className="certificate-eyebrow">{data.eyebrow}</p>
        <h1 id="certificate-showcase-title">{data.courseTitle}</h1>
        <p className="certificate-header-description">{copy.certificateId}: <span className="certificate-id">{data.certificateId}</span></p>
        <CertificateActions data={data} copy={copy} />
        <a className="certificate-view-link" href={data.certificateUrl} target="_blank" rel="noreferrer" aria-label={copy.viewOnProvider} title={copy.viewOnProvider}>
          <CertificateIcon name="external" />
          <span>{copy.viewOnProvider}</span>
        </a>
      </div>
      <a className="certificate-image-link" href={data.certificateUrl} target="_blank" rel="noreferrer" aria-label={copy.openCertificate.replace("{title}", data.courseTitle)}>
        <img className="certificate-image" src={image?.url || ""} alt={image?.alt_text || ""} fetchPriority="high" decoding="async" />
      </a>
    </header>
  );
}

function PerformanceReport({ data, copy }) {
  return (
    <section className="certificate-section" aria-labelledby="certificate-performance-title">
      <div className="certificate-section-heading">
        <p className="certificate-eyebrow">{copy.performanceEyebrow}</p>
        <h2 id="certificate-performance-title">{data.performanceTitle}</h2>
      </div>
      <div className="certificate-performance" aria-label={data.performanceAria}>
        {data.performance.map(({ key, label, value, icon }) => (
          <div className={`certificate-performance-value${key === "percentage" ? " certificate-performance-highlight" : ""}`} key={key}>
            <CertificateIcon name={icon} className="certificate-performance-icon" />
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function AlumniRecognition({ data, copy }) {
  const image = data.assets.find(({ role }) => role === "alumni");
  return (
    <section className="alumni-recognition certificate-surface" aria-labelledby="certificate-alumni-title">
      <div className="alumni-recognition-copy">
        <p className="certificate-eyebrow">{copy.trainersEyebrow}</p>
        <h3 id="certificate-alumni-title">{data.trainersTitle}</h3>
        <p>{data.trainersSubheading}</p>
        <span>{data.trainersDescription}</span>
      </div>
      <img className="certificate-alumni-image" src={image?.url || ""} alt={image?.alt_text || ""} loading="lazy" decoding="async" />
    </section>
  );
}

function KeyTopics({ data, copy }) {
  return (
    <section className="certificate-section" aria-labelledby="certificate-topics-title">
      <div className="certificate-section-heading">
        <p className="certificate-eyebrow">{copy.overviewEyebrow}</p>
        <h2 id="certificate-topics-title">{copy.topicsTitle}</h2>
      </div>
      <ul className="certificate-topics">
        {data.topics.map(({ label, icon }) => (
          <li key={label}>
            <CertificateIcon name={icon} className="certificate-topic-icon" />
            <span>{label}</span>
          </li>
        ))}
      </ul>
      <AlumniRecognition data={data} copy={copy} />
    </section>
  );
}

export default function CertificateShowcase({ data, copy, onBack }) {
  return (
    <main className="certificate-showcase" aria-labelledby="certificate-showcase-title">
      <div className="container certificate-container">
        <CertificateHeader data={data} copy={copy} onBack={onBack} />
        <PerformanceReport data={data} copy={copy} />
        <KeyTopics data={data} copy={copy} />
      </div>
    </main>
  );
}
