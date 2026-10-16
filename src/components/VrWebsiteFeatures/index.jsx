import "./index.css";

function renderDescription(description, emphasizedText) {
  if (typeof description !== "string" || typeof emphasizedText !== "string" || !emphasizedText) {
    return description ?? "";
  }

  const emphasisIndex = description.indexOf(emphasizedText);
  if (emphasisIndex < 0) return description;

  return (
    <>
      {description.slice(0, emphasisIndex)}
      <strong><em>{emphasizedText}</em></strong>
      {description.slice(emphasisIndex + emphasizedText.length)}
    </>
  );
}

function VrWebsiteFeatures({ data }) {
  const features = Array.isArray(data?.features) ? data.features : [];

  return (
    <main className="vr-features-demo">
      <section className="vr-features-section" aria-labelledby="vr-features-heading">
        <div className="container">
          <h1 className="vr-features-heading" id="vr-features-heading">{data?.heading ?? ""}</h1>
          <div className="row">
            {features.map(({ imageUrl, imageAlt, title, description, emphasizedText }, index) => (
              <div className="col-12 col-md-4" key={`${title ?? "feature"}-${index}`}>
                <article className="vr-feature-card text-center">
                  <img className="vr-feature-image" src={imageUrl ?? ""} alt={imageAlt ?? ""} loading="lazy" decoding="async" />
                  <h2 className="vr-feature-title">{title ?? ""}</h2>
                  <p className="vr-feature-description">{renderDescription(description, emphasizedText)}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default VrWebsiteFeatures;
