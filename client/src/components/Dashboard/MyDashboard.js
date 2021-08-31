import React from "react";
require("dotenv").config();

const MyDashboard = () => {
  return (
    <div className="m-5">
      <button
        type="button"
        className="btn btn-primary"
        data-toggle="modal"
        data-target="#exampleModal"
      >
        Log In
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog"
          role="document"
          style={{ boxShadow: "0 8px 16px 0 rgba(0,0,0,0.6)" }}
        >
          <div className="modal-content">
            <div className="modal-body card">
              <button
                type="button"
                className="close ml-auto"
                data-dismiss="modal"
                aria-label="Close"
                style={{ outline: "none" }}
              >
                <span aria-hidden="true">&times;</span>
              </button>
              <p
                style={{
                  alignSelf: "center",
                  fontWeight: "700",
                  fontSize: "25px",
                }}
                className="mt-3"
              >
                Login in to Prototype
              </p>
              <form className="form mt-3">
                <input
                  type="text"
                  placeholder="Email address"
                  style={{
                    width: "100%",
                    borderWidth: "1px",
                    borderStyle: "solid",
                    height: "3rem",
                    borderRadius: "0.5rem",
                    outline: "none",
                  }}
                  required
                />
                <br />
                <br />
                <input
                  type="password"
                  placeholder="Password"
                  style={{
                    width: "100%",
                    borderWidth: "1px",
                    borderStyle: "solid",
                    height: "3rem",
                    borderRadius: "0.5rem",
                    outline: "none",
                  }}
                  required
                />
                <br />
                <a
                  href="#"
                  className="text-primary"
                  style={{ fontWeight: "700", textDecoration: "none" }}
                >
                  Forgot your Password?
                </a>
                <br />
                <br />
                <button
                  className="btn btn-primary"
                  style={{ width: "100%", height: "3rem" }}
                  type="submit"
                >
                  Submit
                </button>
              </form>
              <p style={{ alignSelf: "center", marginTop: "1rem" }}>
                Don't have an account?
                <a
                  className="text-primary"
                  href="#"
                  style={{ fontWeight: "700", textDecoration: "none" }}
                >
                  {" "}
                  Sign Up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyDashboard;
