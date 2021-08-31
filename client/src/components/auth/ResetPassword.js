import React from "react";
import { Fragment } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { resetPassword } from "../../actions/password/resetpassword";
import { verifyOTP } from "../../actions/otp/verifyotp";
import { removeOTP } from "../../actions/otp/removeotp";

const ResetPassword = () => {
  const [values, setValues] = useState({
    otp: "",
  });

  const [newPasword, setNewPassword] = useState({
    password: "",
    confirmPassword: "",
  });

  const history = useHistory();

  const { password, confirmPassword } = newPasword;

  const emailID = window.location.href.substring(
    window.location.href.indexOf("/reset-password/") + "/reset-password/".length
  );

  const { otp } = values;

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const checkOtpMatch = (e) => {
    e.preventDefault();
    verifyOTP(emailID, otp).then((res) => {
      if (res === "SUCCESS") {
        if (document.getElementById("reset-password")) {
          document.getElementById("reset-password").style.visibility =
            "visible";
        }
      } else {
        toast.error("Wrong OTP");
      }
    });
  };

  const handlePasswordChange = (e) => {
    setNewPassword({ ...newPasword, [e.target.name]: e.target.value });
  };

  const handlePasswordChangeSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      resetPassword(emailID, password, confirmPassword)
        .then((data) => {
          toast.success("Password Changed");
          removeOTP(emailID);

          setTimeout(function () {
            history.push("/");
          }, 3000);
        })
        .catch((err) => console.log(err));
    } else {
      toast.error("Password & Confirm Password should be same");
    }
  };
  return (
    <Fragment>
      <div className="card" style={{ border: "none" }}>
        <form
          className="form"
          style={{ alignSelf: "center", marginTop: "8rem" }}
          onSubmit={(e) => checkOtpMatch(e)}
        >
          <label
            style={{
              fontWeight: "100",
              marginTop: "1rem",
              marginBottom: "6px",
            }}
          >
            Enter OTP
          </label>
          <br />
          <input
            style={{
              width: "17rem",
              borderRadius: "5px",
              borderWidth: "1px",
              height: "2rem",
              outline: "none",
              marginLeft: "0.5rem",
            }}
            type="text"
            name="otp"
            value={otp}
            onChange={(e) => handleChange(e)}
            required
          />
          <br />
          <button
            style={{
              width: "15rem",
              marginLeft: "1.5rem",
              borderRadius: "2rem",
            }}
            className="btn btn-primary mt-2"
            type="submit"
          >
            Confirm OTP
          </button>
        </form>
      </div>

      <div className="card mt-5" style={{ border: "none" }}>
        <form
          id="reset-password"
          className="form"
          style={{ alignSelf: "center", visibility: "hidden" }}
          onSubmit={(e) => handlePasswordChangeSubmit(e)}
        >
          <label
            style={{
              fontWeight: "100",
              marginTop: "1rem",
              marginBottom: "6px",
            }}
          >
            Enter New Password
          </label>
          <br />
          <input
            style={{
              width: "17rem",
              borderRadius: "5px",
              borderWidth: "1px",
              height: "2rem",
              outline: "none",
              marginLeft: "0.5rem",
            }}
            type="password"
            name="password"
            value={password}
            onChange={(e) => handlePasswordChange(e)}
            required
          />
          <br />
          <label
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
              width: "17rem",
              borderRadius: "5px",
              borderWidth: "1px",
              height: "2rem",
              outline: "none",
              marginLeft: "0.5rem",
            }}
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => handlePasswordChange(e)}
            required
          />
          <br />
          <button
            style={{
              marginLeft: "1.5rem",
              width: "15rem",
              borderRadius: "2rem",
            }}
            className="btn btn-primary mt-2"
            type="submit"
          >
            Change Password
          </button>
        </form>
      </div>
      <ToastContainer />
    </Fragment>
  );
};

export default ResetPassword;
