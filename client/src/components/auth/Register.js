import React, { Fragment, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";
import "../../App.css";
require("dotenv").config();

const Register = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const history = useHistory();
  const token = localStorage.getItem("token");

  const { name, email, password, confirmPassword } = values;

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6 || confirmPassword.length < 6) {
      toast.error("Password is too short!");
      if (password !== confirmPassword) {
        toast.error("Error! Password don't match");
      }
    } else {
      try {
        await fetch(`${process.env.REACT_APP_SERVER_URL}/api/users`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        })
          .then((res) => res.json())
          // .then((data) => {
          //   fetch(
          //     `${process.env.REACT_APP_SERVER_URL}/api/users/verification-mail/${email}`,
          //     {
          //       headers: {
          //         Accept: "application/json",
          //         "Content-Type": "application/json",
          //       },
          //       method: "GET",
          //     }
          //   )
          //     .then((res) => res.json())
          //     .then((data) => {
          //       toast.success("Verification email sent");
          //       toast.info("Check Inbox");
          //     })
          //     .catch((err) => console.log(err));
          // })
          .catch((err) => {
            toast.error("Registration failed");
          });
      } catch (error) {
        toast.error("Registration failed");
      }
    }
  };

  const disableAll = () => {
    document.getElementById("name-label").style.fontWeight = "100";
    document.getElementById("name-label").style.marginTop = "1rem";
    document.getElementById("email-label").style.fontWeight = "100";
    document.getElementById("email-label").style.marginTop = "1rem";
    document.getElementById("password-label").style.fontWeight = "100";
    document.getElementById("password-label").style.marginTop = "1rem";
    document.getElementById("confirm-password-label").style.fontWeight = "100";
    document.getElementById("confirm-password-label").style.marginTop = "1rem";
  };

  const handleInputInputLabel = (elementID) => {
    if (document.getElementById(`${elementID}`)) {
      disableAll();
      document.getElementById(`${elementID}`).style.fontWeight = "600";
      document.getElementById(`${elementID}`).style.marginTop = "0.5rem";
    }
  };

  return (
    <Fragment>
      {!token && (
        <div
          className="card"
          style={{
            borderWidth: "1.5px",
            marginTop: "6rem",
            borderColor: "gray",
            borderRadius: "1rem",
            marginLeft: "6%",
            marginRight: "6%",
          }}
        >
          <h2
            style={{
              alignSelf: "center",
              marginTop: "2rem",
              fontFamily: "monospace",
            }}
          >
            Sign Up
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
              id="name-label"
              style={{
                fontWeight: "100",
                marginTop: "1rem",
                marginBottom: "6px",
              }}
            >
              Name
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
              onClick={() => handleInputInputLabel("name-label")}
              placeholder="Enter your name"
              type="text"
              name="name"
              value={name}
              onChange={(e) => handleChange(e)}
              required
            />
            <br />
            <label
              id="email-label"
              style={{
                fontWeight: "100",
                marginTop: "1rem",
                marginBottom: "6px",
              }}
            >
              Email Address
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
            <br />
            <label
              id="confirm-password-label"
              style={{
                fontWeight: "100",
                marginTop: "1rem",
                marginBottom: "6px",
              }}
            >
              Confirm Password
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
              onClick={() => handleInputInputLabel("confirm-password-label")}
              placeholder="Confirm your password"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => handleChange(e)}
              required
            />
            <br />
            <br />
            <button
              style={{
                width: "18rem",
                borderRadius: "2rem",
                backgroundColor: "#24a0ed",
                color: "white",
              }}
              className="btn"
              type="submit"
            >
              Register
            </button>
            <br />
            <br />
            <p style={{ marginTop: "-1.0rem", marginLeft: "1rem" }}>
              Already registered?
              <span>
                <a
                  href="/"
                  style={{ textDecoration: "none", color: "#24a0ed" }}
                >
                  {" "}
                  Login
                </a>
              </span>
            </p>
          </form>
        </div>
      )}
      {token && history.push("/dashboard")}
      <ToastContainer />
    </Fragment>
  );
};

export default Register;
