import "./index.css";

function VrWebsiteProducts({ data }) {
  const products = Array.isArray(data?.products) ? data.products : [];

  return (
    <main className="vr-website-products-demo">
      <div className="VRWebsiteProducts-background-Section">
        <div className="container">
          <div className="row">
            <div className="col-12 pt-5">
              <h1 className="VRWebsiteProducts-heading">{data?.heading ?? ""}</h1>
            </div>
            {products.map((product, index) => (
              <div className="col-12 mt-3 col-md-6" key={`${product.titleLines?.[0] ?? "product"}-${index}`}>
                <div
                  className={`background-image-content${index === 0 ? "" : "-2"} d-flex flex-column justify-content-end`}
                  style={{ backgroundImage: product.imageUrl ? `url("${product.imageUrl}")` : "none" }}
                >
                  <div className="pl-3 pb-3">
                    <h1 className="VRWebsiteProducts-VrHeadset">
                      {(Array.isArray(product.titleLines) ? product.titleLines : []).map((line, lineIndex) => (
                        <span key={`${line ?? "title"}-${lineIndex}`}>
                          {line ?? ""}
                          {lineIndex < product.titleLines.length - 1 && <br />}
                        </span>
                      ))}
                    </h1>
                    <p className="VRWebsiteProducts-price">{product.price ?? ""}</p>
                    <button className="custom-button" type="button">{product.buyButtonLabel ?? ""}</button>
                  </div>
                </div>
              </div>
            ))}
            <div className="col-12">
              <div className="d-flex flex-row justify-content-end mt-3 pb-2">
                <button className="custom-button button" type="button">{data?.viewAllLabel ?? ""}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default VrWebsiteProducts;
