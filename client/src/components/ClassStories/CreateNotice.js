import React, { useState } from "react";
import { Fragment } from "react";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
require("dotenv").config();

const CreateNotice = () => {
  const token = localStorage.getItem("token");
  const history = useHistory();
  const [values, setValues] = useState({
    message: "",
    salutation: "",
    department: "",
    year: "",
  });

  const { message, salutation, department, year } = values;
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/notices/create-notice`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "auth-token": `${token}`,
        },
        method: "POST",
        body: JSON.stringify({ message, salutation, department, year }),
      }
    )
      .then((res) => res.json())
      .then((data) => toast.success("Notice Created"))
      .catch((err) => console.log(err));
  };
  return (
    <Fragment>
      {token && (
        <div>
          <form className="form" onSubmit={(e) => handleSubmit(e)}>
            <label
              style={{
                fontWeight: "500",
                marginTop: "0.5rem",
                marginLeft: "0.5rem",
                marginBottom: "0.3rem",
              }}
            >
              Message body:
            </label>
            <br />
            <textarea
              name="message"
              value={message}
              cols="35"
              rows="10"
              onChange={(e) => handleChange(e)}
              style={{ outline: "none" }}
              required
            />
            <br />
            <label
              style={{
                fontWeight: "500",
                marginTop: "0.5rem",
                marginLeft: "0.5rem",
              }}
            >
              Salutation:
            </label>
            <br />
            <textarea
              name="salutation"
              value={salutation}
              style={{ marginTop: "5px" }}
              cols="35"
              rows="2"
              onChange={(e) => handleChange(e)}
              style={{ outline: "none" }}
              required
            />
            <br />
            <label
              className="mt-2"
              style={{
                fontWeight: "500",
                marginBottom: "1px",
                marginLeft: "0.5rem",
              }}
            >
              For which department?
            </label>
            <br />
            <select
              id="depart"
              className="btn"
              style={{ width: "16.5rem", borderColor: "black" }}
              onChange={(e) => handleChange(e)}
              name="department"
              value={department}
              required
            >
              <option value=""> --Select Department-- </option>
              <option value="BCA">BCA</option>
              <option value="BBA">BBA</option>
              <option value="BSc. Computer Science">
                BSc. Computer Science
              </option>
              <option value="BSc. English">BSc. English</option>
              <option value="BSc. Geography">BSc. Geography</option>
            </select>
            <br />
            <label
              className="mt-2"
              style={{
                fontWeight: "500",
                marginBottom: "1px",
                marginLeft: "0.5rem",
              }}
            >
              For which year?
            </label>
            <br />
            <select
              className="btn"
              id="year"
              style={{ width: "16.5rem", borderColor: "black" }}
              onChange={(e) => handleChange(e)}
              name="year"
              value={year}
              required
            >
              <option value=""> --Select Year-- </option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
            </select>
            <br />
            <button
              className="btn btn-primary"
              style={{
                width: "5rem",
                marginTop: "10px",
                marginLeft: "11rem",
                fontWeight: "700",
              }}
              type="submit"
            >
              Create
            </button>
          </form>
        </div>
      )}
      {!token && history.push("/")}
      <ToastContainer />
    </Fragment>
  );
};

export default CreateNotice;
