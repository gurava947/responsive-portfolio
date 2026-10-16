import { Fragment } from "react";
import "./index.css";

function ProfilePage({ data }) {
  return (
    <main className="profile-page-demo">
      <div className="profile-container">
        <h1>{data.name}</h1>
        <p>{data.intro}</p>
        <div className="designation-details-container">
          <p className="designation-details">
            {data.designation.map((line, index) => (
              <Fragment key={line}>
                {index > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </p>
        </div>
      </div>
      <div className="contact-info-container">
        <p className="contact-info">{data.contact}</p>
      </div>
    </main>
  );
}

export default ProfilePage;
