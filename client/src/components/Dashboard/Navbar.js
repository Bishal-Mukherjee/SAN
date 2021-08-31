import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { isAuth, isToken, logoutActions } from "../../actions/auth";
import { getHeading } from "../../actions/NavHeading";
import {
  deleteNotificationsActions,
  getNotificationsActions,
} from "../../actions/posts/notifications";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [notification, setNotification] = useState([]);

  const history = useHistory();

  let fHeading = getHeading();

  const getNotifications = () => {
    getNotificationsActions(isToken())
      .then((data) => setNotification(data))
      .catch((err) => console.log(err));
  };

  const deleteNotifications = () => {
    deleteNotificationsActions(isToken())
      .then((data) => {
        setTimeout(function () {
          window.location.reload();
        }, 1000);
      })
      .catch((err) => console.log(err));
  };

  const handleLogout = () => {
    logoutActions();
    history.push("/");
    window.location.reload();
  };

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light"
      style={{
        backgroundColor: "#0052cc",
        height: "3.3rem",
        marginRight: "-50px",
      }}
    >
      <p
        style={{
          marginTop: "13px",
          marginLeft: "1.9rem",
          fontWeight: "300",
          fontSize: "20px",
          color: "white",
          position: "absolute",
        }}
      >
        {fHeading}
      </p>

      <button
        data-toggle="modal"
        data-target="#notificationMessages"
        className="mr-2 ml-auto"
        style={{ background: "none", border: "none" }}
        onClick={() => {
          getNotifications();
        }}
      >
        <i className="fas fa-bell" style={{ color: "white" }}>
          {!user.notificationMessage && <span className="ml-1">0</span>}
          {user.notificationMessage && (
            <span className="ml-1">{notification.length}</span>
          )}
        </i>
      </button>

      {window.innerWidth < 490 && (
        <div
          className="modal fade"
          id="notificationMessages"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div
            className="modal-dialog"
            role="document"
            style={{ width: "23rem" }}
          >
            <div className="modal-content card">
              <p
                style={{
                  alignSelf: "center",
                  fontSize: "25px",
                  marginTop: "1rem",
                }}
              ></p>
              <div className="modal-body card" style={{ borderColor: "white" }}>
                <div>
                  {notification.map((message) => (
                    <div className="card mt-2 rounded">
                      <a
                        href={`/loc/${message.post_link}/view`}
                        className="mt-2 text-center"
                        style={{ textDecoration: "none", color: "black" }}
                      >
                        <br />
                        {message.text}
                        <br />
                        <span>{message.date.substring(0, 10)}</span>
                      </a>
                    </div>
                  ))}
                </div>
                <button
                  className="btn btn-danger mt-2"
                  onClick={() => deleteNotifications()}
                >
                  Clear Notifications
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {window.innerWidth > 490 && (
        <div
          className="modal fade"
          id="notificationMessages"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content card">
              <div className="modal-body card" style={{ borderColor: "white" }}>
                <div>
                  {notification.length === 0 && (
                    <p
                      className="text-center"
                      style={{ fontWeight: "100", fontSize: "25px" }}
                    >
                      No notifications yet
                    </p>
                  )}
                  {notification.map((message) => (
                    <div className="card mt-1 rounded">
                      <a
                        href={`/loc/${message.post_link}/view`}
                        className="text-center mb-1"
                        style={{ textDecoration: "none", color: "black" }}
                      >
                        <br />
                        {message.text}
                        <br />
                        <span>{message.date.substring(0, 10)}</span>
                      </a>
                    </div>
                  ))}
                </div>
                <button
                  className="btn btn-danger mt-2"
                  onClick={() => deleteNotifications()}
                >
                  Clear Notifications
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        className="btn btn-primary"
        data-toggle="modal"
        data-target="#logOut"
        style={{
          marginRight: "2rem",
          height: "2.5rem",
          marginTop: "-0.1rem",
        }}
      >
        <i style={{ marginTop: "-0.2rem" }} className="fas fa-sign-out-alt">
          <br />
          <span style={{ fontWeight: "100" }}>Log out</span>
        </i>
      </button>

      {window.innerWidth <= 500 && (
        <div
          class="modal fade"
          id="logOut"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog" role="document">
            <div class="modal-content card" style={{ width: "23.5rem" }}>
              <p
                style={{
                  alignSelf: "center",
                  fontSize: "23px",
                  marginTop: "1rem",
                }}
              >
                Are you sure you want to Logout ?
              </p>
              <div className="modal-body">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  style={{ marginLeft: "5rem", alignSelf: "center" }}
                  data-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  style={{ marginLeft: "1rem" }}
                  type="button"
                  class="btn btn-outline-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {window.innerWidth > 500 && (
        <div
          class="modal fade"
          id="logOut"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog" role="document">
            <div class="modal-content card">
              <p
                style={{
                  alignSelf: "center",
                  fontSize: "23px",
                  marginTop: "1rem",
                }}
              >
                Are you sure you want to Logout ?
              </p>
              <div className="modal-body" style={{ alignSelf: "center" }}>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  style={{ alignSelf: "center" }}
                  data-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  style={{ marginLeft: "1rem" }}
                  type="button"
                  class="btn btn-outline-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
