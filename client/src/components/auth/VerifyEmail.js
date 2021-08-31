import React, { useEffect } from "react";
import { Fragment } from "react";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const VerifyEmail = () => {
  const userID = window.location.href.substring(
    window.location.href.indexOf("/verify/") + 8,
    window.location.href.indexOf("/account-verification/")
  );

  const history = useHistory();
  const verifyUser = () => {
    setTimeout(function () {
      if (document.getElementById("dot-1")) {
        document.getElementById("dot-1").style.visibility = "visible";
        setTimeout(function () {
          if (document.getElementById("dot-2")) {
            document.getElementById("dot-2").style.visibility = "visible";
            setTimeout(function () {
              if (document.getElementById("dot-3")) {
                document.getElementById("dot-3").style.visibility = "visible";
                setTimeout(function () {
                  if (document.getElementById("dot-4")) {
                    document.getElementById("dot-4").style.visibility =
                      "visible";
                    fetch(
                      `${process.env.REACT_APP_SERVER_URL}/api/users/request-user-verify/${userID}`,
                      {
                        headers: {
                          Accept: "application/json",
                        },
                        method: "PUT",
                      }
                    )
                      .then((res) => res.json())
                      .then(() => {
                        toast.success("Verified");
                        setTimeout(function () {
                          history.push("/");
                        }, 1000);
                      })
                      .catch((err) => console.log(err));
                  }
                }, 1000);
              }
            }, 1000);
          }
        }, 1000);
      }
    }, 1000);
  };

  useEffect(() => {
    verifyUser();
  }, []);

  return (
    <Fragment>
      <div className="card mt-5" style={{ borderColor: "white" }}>
        <div className="text-center">
          <p style={{ fontSize: "4.5rem", fontWeight: "100" }}>
            Verifying Email
          </p>
          <div>
            <b
              id="dot-1"
              style={{
                fontSize: "2.5rem",
                visibility: "hidden",
                color: "black",
              }}
              className="ml-1"
            >
              .
            </b>
            <b
              id="dot-2"
              style={{
                fontSize: "2.5rem",
                visibility: "hidden",
                color: "black",
              }}
              className="ml-1"
            >
              .
            </b>
            <b
              id="dot-3"
              style={{
                fontSize: "2.5rem",
                visibility: "hidden",
                color: "black",
              }}
              className="ml-1"
            >
              .
            </b>
            <b
              id="dot-4"
              style={{
                fontSize: "2.5rem",
                visibility: "hidden",
                color: "black",
              }}
              className="ml-1"
            >
              .
            </b>
          </div>
        </div>
      </div>
      <ToastContainer />
    </Fragment>
  );
};

export default VerifyEmail;
