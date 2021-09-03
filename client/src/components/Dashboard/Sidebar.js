import React, { useEffect } from "react";
import Dashboard from "./Dashboard";
import Navbar from "../Dashboard/Navbar";
import ClassStories from "../ClassStories/ClassStories";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Profile from "../ClassStories/Profile";
import CreateNotice from "../ClassStories/CreateNotice";
import MyDashboard from "./MyDashboard";
import AddAssignment from "../Assignment/AddAssignment";
import { isAuth } from "../../actions/auth";
import ApprovePosts from "./ApprovePosts";
import { Fragment } from "react";
import ViewDoubts from "../ClassStories/ViewDoubts";
import ViewAssignment from "../ClassStories/ViewAssignment";
import FacultyDashboard from "./FacultyDashboard";
import AssignmentsByName from "../Assignment/AssignmentsByName";

const Sidebar = () => {
  let department, designation, year;
  let name;
  if (isAuth()) {
    const loggedInUser = isAuth();
    department = loggedInUser.department;
    designation = loggedInUser.designation;
    year = loggedInUser.year;
    name = loggedInUser.name;
  }

  const history = useHistory();

  const heading = window.location.href.substring(
    window.location.href.indexOf("/loc/") + 5,
    window.location.href.length
  );

  const colorChange = () => {
    if (heading === "dashboard") {
      if (document.getElementById("dashboard-button")) {
        document.getElementById("dashboard-button").style.color = "white";
      }
    }

    if (heading.substring(0, 9) === "dashboard") {
      if (document.getElementById("dashboard-button")) {
        document.getElementById("dashboard-button").style.color = "white";
      }
    }
    if (heading === "class-stories") {
      if (document.getElementById("class-stories-button")) {
        document.getElementById("class-stories-button").style.color = "white";
      }
    }
    if (heading === "profile") {
      if (document.getElementById("profile-button")) {
        document.getElementById("profile-button").style.color = "white";
      }
    }
    if (heading === "create-notice") {
      if (document.getElementById("create-notice-button")) {
        document.getElementById("create-notice-button").style.color = "white";
      }
    }
    if (heading === "add-assignment") {
      if (document.getElementById("add-assignment-button")) {
        document.getElementById("add-assignment-button").style.color = "white";
      }
    }

    if (heading === "approve-posts") {
      if (document.getElementById("approve-posts-button")) {
        document.getElementById("approve-posts-button").style.color = "white";
      }
    }

    if (heading.substring(0, 7) === "profile") {
      if (document.getElementById("profile-button")) {
        document.getElementById("profile-button").style.color = "white";
      }
    }
  };

  useEffect(() => {
    colorChange();
  }, []);

  return (
    <Fragment>
      {isAuth() && (
        <div>
          <div id="mySidebar" className="sidebar" style={{ width: "67px" }}>
            <a
              style={{ cursor: "pointer" }}
              className="closebtn"
              onClick={() => {
                document.getElementById("mySidebar").style.width = "0";
                document.getElementById("main").style.marginLeft = "0";
              }}
            ></a>
            <br />
            <p
              style={{
                color: "white",
                marginLeft: "0.5rem",
                fontWeight: "100",
                marginTop: "-2rem",
              }}
            >
              {designation}
            </p>
            {isAuth().designation === "HOD" && (
              <div>
                <a href="/loc/dashboard/faculty" style={{ marginTop: "-1rem" }}>
                  <i id="dashboard-button" className="fas fa-inbox"></i>
                </a>
                <p
                  style={{
                    fontSize: "12px",
                    marginTop: "-5px",
                    color: "white",
                    marginLeft: "4px",
                    fontWeight: "600",
                  }}
                >
                  Dashboard
                </p>
              </div>
            )}

            {isAuth().designation === "Faculty" && (
              <div>
                <a href="/loc/dashboard/faculty" style={{ marginTop: "-1rem" }}>
                  <i id="dashboard-button" className="fas fa-inbox"></i>
                </a>
                <p
                  style={{
                    fontSize: "12px",
                    marginTop: "-5px",
                    color: "white",
                    marginLeft: "4px",
                    fontWeight: "600",
                  }}
                >
                  Dashboard
                </p>
              </div>
            )}

            {isAuth().designation !== "HOD" &&
              isAuth().designation !== "Faculty" && (
                <div>
                  <a href="/loc/dashboard" style={{ marginTop: "-1rem" }}>
                    <i id="dashboard-button" className="fas fa-inbox"></i>
                  </a>
                  <p
                    style={{
                      fontSize: "12px",
                      marginTop: "-5px",
                      color: "white",
                      marginLeft: "4px",
                      fontWeight: "600",
                    }}
                  >
                    Dashboard
                  </p>
                </div>
              )}

            {designation && (
              <div style={{ marginTop: "-1rem" }}>
                <a href="/loc/class-stories">
                  <i id="class-stories-button" className="fas fa-tasks"></i>
                </a>
                <p
                  style={{
                    fontSize: "13px",
                    marginTop: "-5px",
                    color: "white",
                    marginLeft: "18px",
                    fontWeight: "600",
                  }}
                >
                  Class <span style={{ marginLeft: "-4px" }}>Stories</span>
                </p>
              </div>
            )}

            <div style={{ marginTop: "-1rem" }}>
              <a href="http://www.sxcb.edu.in">
                <i className="fas fa-globe"></i>
              </a>
              <p
                style={{
                  fontSize: "13px",
                  marginTop: "-5px",
                  color: "white",
                  marginLeft: "10px",
                  fontWeight: "600",
                }}
              >
                College Website
              </p>
            </div>

            <div>
              {isAuth().designation && isAuth().designation !== "Student" && (
                <div style={{ marginTop: "-1rem" }}>
                  <a href="/loc/add-assignment">
                    <i id="add-assignment-button" className="fas fa-plus"></i>
                  </a>
                  <p
                    style={{
                      fontSize: "13px",
                      marginTop: "-5px",
                      color: "white",
                      marginLeft: "1.2rem",
                      fontWeight: "600",
                    }}
                  >
                    Add <br />
                    <span style={{ fontSize: "11px", marginLeft: "-1.0rem" }}>
                      Assignment
                    </span>
                  </p>
                </div>
              )}
            </div>

            {designation &&
              designation !== "Student" &&
              designation !== "Faculty" && (
                <div style={{ marginTop: "-1rem" }}>
                  <a href="/loc/create-notice">
                    <i
                      id="create-notice-button"
                      className="fas fa-pencil-alt"
                    ></i>
                  </a>
                  <p
                    style={{
                      fontSize: "13px",
                      marginTop: "-5px",
                      color: "white",
                      marginLeft: "12px",
                      fontWeight: "600",
                    }}
                  >
                    Create Notice
                  </p>
                </div>
              )}

            {designation === "Admin" && (
              <div style={{ marginTop: "-1rem" }}>
                <a href="/loc/approve-posts">
                  <i id="approve-posts-button" className="fas fa-check"></i>
                </a>
                <p
                  style={{
                    fontSize: "13px",
                    marginTop: "-5px",
                    color: "white",
                    marginLeft: "11px",
                    fontWeight: "600",
                  }}
                >
                  Approve <br />
                  <span className="ml-2">Posts</span>
                </p>
              </div>
            )}

            <div style={{ marginTop: "-1rem" }}>
              <a href={`/loc/profile/${name}`}>
                <i id="profile-button" className="fas fa-user"></i>
              </a>
              <p
                style={{
                  fontSize: "13px",
                  marginTop: "-5px",
                  color: "white",
                  marginLeft: "1.4rem",
                  fontWeight: "600",
                }}
              >
                My <br />
                <span style={{ marginLeft: "-0.4rem" }}>Profile</span>
              </p>
            </div>
          </div>
          <div id="main" style={{ marginLeft: "67px" }}>
            <div style={{ marginTop: "-20px", marginLeft: "-20px" }}>
              <Navbar />
            </div>

            <button
              className="openbtn"
              style={{ marginLeft: "-16px", marginTop: "-47px" }}
              onClick={() => {
                document
                  .getElementById("arrowDirection")
                  .classList.toggle("fa-arrow-right");
                if (
                  document.getElementById("main").style.marginLeft === "67px"
                ) {
                  document.getElementById("mySidebar").style.width = "0";
                  document.getElementById("main").style.marginLeft = "0";
                } else {
                  document.getElementById("main").style.marginLeft = "67px";
                  document.getElementById("mySidebar").style.width = "67px";
                }
              }}
            >
              <i className="fas fa-arrow-left" id="arrowDirection"></i>
            </button>
            <BrowserRouter>
              <Switch>
                <Route exact path="/loc/dashboard" component={Dashboard} />
                <Route exact path="/mydashboard" component={MyDashboard} />
                <Route
                  exact
                  path="/loc/class-stories"
                  component={ClassStories}
                />
                <Route
                  exact
                  path="/loc/profile/:user_name/"
                  component={Profile}
                />
                <Route
                  exact
                  path="/loc/create-notice"
                  component={CreateNotice}
                />
                <Route
                  exact
                  path="/loc/add-assignment"
                  component={AddAssignment}
                />
                <Route
                  exact
                  path="/loc/approve-posts"
                  component={ApprovePosts}
                />
                <Route
                  exact
                  path="/loc/doubts/:post_id"
                  component={ViewDoubts}
                />
                <Route
                  exact
                  path="/loc/:postID/view"
                  component={ViewAssignment}
                />
                <Route
                  exact
                  path="/loc/dashboard/faculty"
                  component={FacultyDashboard}
                />
                <Route
                  exact
                  path="/loc/find_posts"
                  component={AssignmentsByName}
                />
              </Switch>
            </BrowserRouter>
          </div>
        </div>
      )}
      {!isAuth() && history.push("/")}
    </Fragment>
  );
};

export default Sidebar;
