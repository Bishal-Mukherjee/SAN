import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { useHistory } from "react-router-dom";
import userImage from "../../assets/userImage.png";
require("dotenv").config();

const Profile = () => {
  const history = useHistory();
  const [profile, setProfile] = useState({});
  const token = localStorage.getItem("token");

  const getProfile = async () => {
    await fetch(`${process.env.REACT_APP_SERVER_URL}/api/users/profile`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": `${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <Fragment>
      {token && (
        <div className="card mt-2" style={{ borderColor: "white" }}>
          <div style={{ marginTop: "1rem", marginLeft: "1rem" }}>
            <img src={userImage} style={{ borderRadius: "1rem" }} />
            <p
              style={{
                fontFamily: "cursive",
                fontSize: "30px",
                marginLeft: "1rem",
              }}
            >
              {profile.name}
            </p>
            <p style={{ marginLeft: "1.8rem", marginTop: "-13px" }}>
              {profile.email}
            </p>
            <ul>
              <li>{profile.institution}</li>
              <li>{profile.designation}</li>
              <li>{profile.department}</li>
              <li>{profile.year}</li>
            </ul>
          </div>
        </div>
      )}
      {!token && history.push("/")}
    </Fragment>
  );
};

export default Profile;
