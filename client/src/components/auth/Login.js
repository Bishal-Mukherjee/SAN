import React, { useState } from "react";
import { Fragment } from "react";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  isAuth,
  isToken,
  loginActions,
  logoutActions,
} from "../../actions/auth";
import { genOtp } from "../../actions/otp/generateotp";
require("dotenv").config();

const Login = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [userEmail, setUserEmail] = useState({
    femail: "",
  });

  const { femail } = userEmail;

  const history = useHistory();
  const token = isToken();

  const { email, password } = values;

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${process.env.REACT_APP_SERVER_URL}/api/auth`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        else toast.error("Login failed");
      })
      .then((data) => {
        loginActions(data.user, data.token);
        if (isAuth().designation) {
          if (
            isAuth().designation === "HOD" ||
            isAuth().designation === "Faculty"
          ) {
            history.push("/loc/dashboard/faculty");
          } else {
            history.push("/loc/dashboard");
          }
        } else {
          history.push(`/loc/profile/${isAuth().name}`);
        }
      })
      .catch((err) => {
        console.log(err);
        logoutActions();
      });
  };

  const visibleEmail = () => {
    if (document.getElementById("forgot-password-email")) {
      if (
        document.getElementById("forgot-password-email").style.visibility ===
        "hidden"
      ) {
        document.getElementById("forgot-password-email").style.visibility =
          "visible";
      } else {
        document.getElementById("forgot-password-email").style.visibility =
          "hidden";
      }
    }
  };

  const handleForgotPasswordEmail = (e) => {
    setUserEmail({ ...userEmail, [e.target.name]: e.target.value });
  };
  const disableAll = () => {
    document.getElementById("email-label").style.fontWeight = "100";
    document.getElementById("email-label").style.marginTop = "1rem";
    document.getElementById("password-label").style.fontWeight = "100";
    document.getElementById("password-label").style.marginTop = "1rem";
  };

  const handleInputInputLabel = (elementID) => {
    if (document.getElementById(`${elementID}`)) {
      disableAll();
      document.getElementById(`${elementID}`).style.fontWeight = "600";
      document.getElementById(`${elementID}`).style.marginTop = "0.5rem";
    }
  };

  const handleForgotPasswordEmailSubmit = (e) => {
    e.preventDefault();
    genOtp(femail).then((res) => {
      if (res) {
        toast.success("OTP Sent!");
        setTimeout(function () {
          history.push(`/reset-password/${femail}`);
        }, 3000);
      }
      if (!res) {
        toast.error("Try again!");
      }
    });
  };

  function viewPassword() {
    if (
      document.getElementById("view-password").style.visibility == "visible"
    ) {
      document.getElementById("view-password").style.visibility = "hidden";
      document.getElementById("unview-password").style.visibility = "visible";
    } else {
      document.getElementById("view-password").style.visibility = "visible";
      document.getElementById("unview-password").style.visibility = "hidden";
    }

    var targetInput = document.getElementById("password-input");
    if (targetInput.type === "password") {
      targetInput.type = "text";
    } else {
      targetInput.type = "password";
    }
  }

  return (
    <Fragment>
      {!token && (
        <div>
          <div
            className="card"
            style={{
              borderWidth: "1.5px",
              marginTop: "9rem",
              borderColor: "gray",
              borderRadius: "1rem",
              marginLeft: "6%",
              marginRight: "6%",
              paddingTop: "1.5rem",
              paddingBottom: "1.5rem",
            }}
          >
            <h2
              style={{
                alignSelf: "center",
                marginTop: "0.5rem",
                fontFamily: "monospace",
              }}
            >
              Sign In
            </h2>
            <hr style={{ margin: "2%", height: "0.5px" }} />

            <form
              className="form"
              style={{ alignSelf: "center" }}
              onSubmit={(e) => {
                handleSubmit(e);
              }}
            >
              <label
                id="email-label"
                style={{
                  fontWeight: "100",
                  marginTop: "1rem",
                  marginBottom: "6px",
                }}
              >
                Email address
              </label>
              <br />
              <input
                style={{
                  width: "18rem",
                  borderRadius: "5px",
                  borderWidth: "1px",
                  height: "2rem",
                  outline: "none",
                  marginLeft: "0.5rem",
                }}
                onClick={() => handleInputInputLabel("email-label")}
                placeholder="Enter your email"
                type="text"
                name="email"
                value={email}
                onChange={(e) => handleChange(e)}
                required
              />
              <br />
              <label
                id="password-label"
                style={{
                  fontWeight: "100",
                  marginTop: "1rem",
                  marginBottom: "6px",
                }}
              >
                Password
              </label>
              <br />
              <input
                id="password-input"
                style={{
                  width: "18rem",
                  borderRadius: "5px",
                  borderWidth: "1px",
                  height: "2rem",
                  outline: "none",
                  marginLeft: "0.5rem",
                }}
                onClick={() => handleInputInputLabel("password-label")}
                placeholder="Enter your password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => handleChange(e)}
                required
              />
              <i
                id="view-password"
                className="fas fa-eye ml-1 fa-1x"
                style={{ cursor: "pointer", visibility: "visible" }}
                onClick={() => viewPassword()}
              ></i>
              <i
                id="unview-password"
                className="fas fa-eye-slash fa-1x"
                style={{
                  cursor: "pointer",
                  visibility: "hidden",
                  marginLeft: "-19px",
                }}
                onClick={() => viewPassword()}
              ></i>

              <br />
              <br />
              <button
                style={{
                  width: "19rem",
                  borderRadius: "2rem",
                  backgroundColor: "#24a0ed",
                  color: "white",
                }}
                className="btn"
                type="submit"
              >
                Log in
              </button>
              <br />
              <br />
              <p style={{ marginTop: "-0.5rem", marginLeft: "1rem" }}>
                Not registered?
                <span>
                  <a
                    href="/register"
                    style={{ textDecoration: "none", color: "#24a0ed" }}
                  >
                    {" "}
                    Register
                  </a>
                </span>
                <br />
                <p>
                  Forgot Password?
                  <span>
                    <a
                      style={{
                        textDecoration: "none",
                        color: "#24a0ed",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        visibleEmail();
                      }}
                    >
                      {" "}
                      Click Me
                    </a>
                  </span>
                </p>
              </p>
            </form>
          </div>
          <div
            id="forgot-password-email"
            className="card mt-3"
            style={{ border: "none", visibility: "hidden" }}
          >
            <form
              className="form"
              style={{ alignSelf: "center" }}
              onSubmit={(e) => handleForgotPasswordEmailSubmit(e)}
            >
              <label
                style={{
                  fontWeight: "100",
                  marginLeft: "-1rem",
                  marginBottom: "6px",
                }}
              >
                Email
              </label>
              <br />
              <input
                name="femail"
                value={femail}
                placeholder="Enter registered email"
                style={{
                  width: "17rem",
                  borderRadius: "5px",
                  borderWidth: "1px",
                  height: "2rem",
                  outline: "none",
                  marginLeft: "0.5rem",
                }}
                onChange={(e) => handleForgotPasswordEmail(e)}
              />
              <br />
              <button
                style={{
                  width: "10rem",
                  borderRadius: "2rem",
                  marginLeft: "7.5rem",
                }}
                className="btn btn-secondary mt-1 mb-3"
                type="submit"
              >
                Send OTP
              </button>
            </form>
          </div>
        </div>
      )}
      {token && history.push("/loc/dashboard")}

      <ToastContainer />
    </Fragment>
  );
};

export default Login;
