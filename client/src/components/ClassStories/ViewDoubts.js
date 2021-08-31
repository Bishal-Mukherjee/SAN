import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { useHistory } from "react-router-dom";
import { isAuth } from "../../actions/auth";
import { isToken } from "../../actions/auth";
import userImage from "../../assets/userImage.png";
require("dotenv").config();

const ViewDoubts = () => {
  const history = useHistory();
  const token = isToken();
  const [doubts, setDoubts] = useState([]);

  const indexOfDouts = window.location.href.indexOf("/doubts/");
  const postID = window.location.href.substring(indexOfDouts + 8);

  const getDoubts = async () => {
    await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/posts/${postID}/doubts`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "auth-token": `${token}`,
        },
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((data) => setDoubts(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getDoubts();
  }, []);

  return (
    <Fragment>
      {isAuth() && (
        <div>
          <div>
            {doubts.length === 0 && (
              <p style={{ fontSize: "30px", fontWeight: "100" }}>
                No doubts yet
              </p>
            )}
            {doubts.map((doubt, i) => (
              <div
                className="card mt-3"
                style={{ borderColor: "gray", borderRadius: "1rem" }}
              >
                <div className="card-body text-center">
                  <img
                    src={userImage}
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                      borderRadius: "2rem",
                    }}
                  />
                  <p>{doubt.name}</p>
                  <p>
                    <b>doubt:</b> {doubt.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {!isAuth && history.push("/")}
    </Fragment>
  );
};

export default ViewDoubts;
