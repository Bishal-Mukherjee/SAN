import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isAuth, isToken } from "../../actions/auth";
require("dotenv").config();

const Dashboard = () => {
  const history = useHistory();
  const [notices, setNotices] = useState([]);
  const [values, setValues] = useState({});
  const loggedInUser = isAuth();

  const token = isToken();

  const { name, designation, year, department, institution } = loggedInUser;

  const getNotices = async () => {
    await fetch(`${process.env.REACT_APP_SERVER_URL}/api/notices/get-notices`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": `${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setNotices(data))
      .catch((err) => console.log(err));
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });

    if (document.getElementById("desig").value === "HOD") {
      document.getElementById("year").disabled = true;
      document.getElementById("year-label").style.color = "gray";
    } else {
      document.getElementById("year").disabled = false;
      document.getElementById("year-label").style.color = "black";
    }

    if (document.getElementById("desig").value === "Faculty") {
      document.getElementById("depart-label").style.color = "gray";
      document.getElementById("year-label").style.color = "gray";
      document.getElementById("depart").disabled = true;
    } else {
      if (document.getElementById("desig").value !== "HOD") {
        document.getElementById("depart-label").style.color = "black";
        document.getElementById("year-label").style.color = "black";
        document.getElementById("year").disabled = false;
        document.getElementById("depart").disabled = false;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { designation, year, department, institution } = values;
    await fetch(`${process.env.REACT_APP_SERVER_URL}/api/users/edit-user`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": `${token}`,
      },
      body: JSON.stringify({ designation, department, year, institution }),
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("Details added");
        toast.info("Please login again");
        setTimeout(function () {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          history.push("/");
          window.location.reload();
        }, 3000);
      })
      .catch((err) => console.log(err));
  };

  if (!designation) {
    history.push(`/loc/profile/${name}`);
  }

  useEffect(() => {
    getNotices();
  }, []);

  return (
    <Fragment>
      {token && (
        <div>
          <div>
            <button
              id="modal-trigger"
              type="button"
              className="btn btn-primary"
              data-toggle="modal"
              data-target="#addDetails"
              style={{ visibility: "hidden" }}
            >
              Add details
            </button>

            <div
              className="modal fade"
              id="addDetails"
              data-backdrop="static"
              tabindex="-1"
              role="dialog"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div
                className="modal-dialog"
                role="document"
                style={{
                  boxShadow: "0 8px 16px 0 rgba(0,0,0,0.6)",
                  width: "95%",
                }}
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
                        fontWeight: "100",
                        fontSize: "25px",
                      }}
                      className="mt-3"
                    >
                      Add Details
                    </p>

                    <form
                      className="form mt-3"
                      onSubmit={(e) => handleSubmit(e)}
                    >
                      <label
                        className="mt-2"
                        style={{
                          fontWeight: "500",
                          marginBottom: "1px",
                          marginLeft: "0.5rem",
                        }}
                      >
                        Select Designation :
                      </label>
                      <select
                        className="btn"
                        id="desig"
                        style={{ width: "100%", borderColor: "black" }}
                        onChange={(e) => handleChange(e)}
                        name="designation"
                        value={designation}
                        required
                      >
                        <option value=""> --Select Designation-- </option>
                        <option value="HOD">Head Of Department</option>
                        <option value="Faculty">Faculty</option>
                        <option value="Student">Student</option>
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
                        Select Institution :
                      </label>
                      <br />
                      <select
                        id="institution"
                        className="btn"
                        style={{ width: "100%", borderColor: "black" }}
                        onChange={(e) => handleChange(e)}
                        name="institution"
                        value={institution}
                        required
                      >
                        <option value=""> --Select Institution-- </option>
                        <option value="St. Xavier's College, Burdwan">
                          St. Xavier's College, Burdwan
                        </option>
                        <option value="University of Technology, Burdwan">
                          University of Technology, Burdwan
                        </option>
                      </select>
                      <br />

                      <label
                        id="depart-label"
                        className="mt-2"
                        style={{
                          fontWeight: "500",
                          marginBottom: "1px",
                          marginLeft: "0.5rem",
                        }}
                      >
                        Select Your Department :
                      </label>
                      <br />
                      <select
                        id="depart"
                        className="btn"
                        style={{ width: "100%", borderColor: "black" }}
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
                        id="year-label"
                        className="mt-2"
                        style={{
                          fontWeight: "500",
                          marginBottom: "1px",
                          marginLeft: "0.5rem",
                        }}
                      >
                        Select Year (current) :
                      </label>
                      <select
                        className="btn"
                        id="year"
                        style={{ width: "100%", borderColor: "black" }}
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

                      <br />
                      <button
                        className="btn btn-primary mt-3"
                        style={{ width: "100%", height: "3rem" }}
                        type="submit"
                      >
                        Submit
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {notices.map((notice, i) => (
            <div
              key={i}
              className="card mb-2"
              style={{ backgroundColor: "#f2f2f2" }}
            >
              <p
                className="m-2"
                style={{
                  fontWeight: "700",
                  fontSize: "large",
                  fontFamily: "Times New Roman",
                  color: "GrayText",
                }}
              >
                Message
              </p>
              <p
                style={{
                  marginTop: "-10px",
                  marginLeft: "5px",
                  marginBottom: "-2px",
                }}
              >
                {notice.date.substring(0, 10)}
              </p>
              <div
                className="card"
                style={{
                  borderTopWidth: "3px",
                  marginLeft: "2px",
                  marginRight: "2px",
                  marginBottom: "2px",
                }}
              >
                <p>{notice.message}</p>
                <p className="mt-5" style={{ marginBottom: "-1px" }}>
                  {notice.salutation}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      {!token && history.push("/")}
      <ToastContainer />
    </Fragment>
  );
};

export default Dashboard;
