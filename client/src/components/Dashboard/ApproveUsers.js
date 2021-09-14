import React, { useEffect, useState } from "react";
import { isToken } from "../../actions/auth";
import userImage from "../../assets/userImage.png";
require("dotenv").config();

const ApproveUsers = () => {
  const [pendingusers, setPendingUser] = useState([]);
  const token = isToken();
  let approveUserId;

  const getUsers = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/users/all-users`, {
      headers: {
        Accept: "application/json",
        "auth-token": `${token}`,
      },
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setPendingUser(data));
  };

  const handleUserApproval = () => {
    fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/users/approve-user/${approveUserId}`,
      {
        headers: {
          Accept: "application/json",
          "auth-token": `${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then(() => window.location.reload());
  };

  const handleUserDenial = (denyuserId) => {
    fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/users/deny-approval-user/${denyuserId}`,
      {
        headers: {
          Accept: "application/json",
          "auth-token": `${token}`,
        },
      }
    ).then((res) => res.json());
  };

  const handleCheckClick = (
    userIdCrossMark,
    userIdCheckMark,
    userIdApproved,
    userIdApproval
  ) => {
    if (document.getElementById(userIdCrossMark)) {
      document.getElementById(userIdCrossMark).style.visibility = "visible";
    }
    if (document.getElementById(userIdCheckMark)) {
      document.getElementById(userIdCheckMark).style.visibility = "hidden";
    }
    if (document.getElementById(userIdApproved)) {
      document.getElementById(userIdApproved).style.visibility = "hidden";
    }
    if (document.getElementById(userIdApproval)) {
      document.getElementById(userIdApproval).style.visibility = "visible";
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      {pendingusers.map((user, i) => (
        <div className="card mt-3" key={i}>
          {user.approved == true && (
            <div style={{ alignSelf: "flex-end" }}>
              <i
                id={`${user._id}-check-mark`}
                className="far fa-check-circle mt-1 mr-2"
                style={{
                  color: "green",
                  cursor: "pointer",
                  position: "absolute",
                }}
                onClick={() => {
                  handleUserDenial(user._id);
                  handleCheckClick(
                    `${user._id}-cross-mark`,
                    `${user._id}-check-mark`,
                    `${user._id}-approved-button`,
                    `${user._id}-approval-button`
                  );
                }}
              ></i>
              <i
                id={`${user._id}-cross-mark`}
                className="fas fa-times-circle mt-1 mr-2"
                style={{ color: "red", visibility: "hidden" }}
              ></i>
            </div>
          )}
          {user.approved == false && (
            <div style={{ alignSelf: "flex-end" }}>
              <i
                className="fas fa-times-circle mt-1 mr-2"
                style={{ color: "red" }}
              ></i>
            </div>
          )}

          <img
            src={userImage}
            style={{
              width: "3rem",
              borderRadius: "2rem",
              alignSelf: "center",
            }}
          />
          <p style={{ alignSelf: "center" }}>{user.name}</p>
          <p style={{ alignSelf: "center", marginTop: "-0.7rem" }}>
            {user.email}
          </p>
          <p style={{ alignSelf: "center" }}>{user.institution}</p>
          <p style={{ alignSelf: "center", marginTop: "-0.5rem" }}>
            {user.designation} {user.department}
          </p>

          {user.approved == true && (
            <div
              className="row"
              style={{
                alignSelf: "center",
              }}
            >
              <button
                id={`${user._id}-approved-button`}
                className="mb-2 mr-1 rounded"
                style={{
                  width: "6.5rem",
                  height: "2.5rem",
                  alignSelf: "center",
                  borderStyle: "bold",
                  borderColor: "green",
                  outline: "none",
                  position: "relative",
                  cursor: "default",
                }}
              >
                Approved
              </button>

              <button
                id={`${user._id}-approval-button`}
                className="mb-2 btn-success rounded"
                data-toggle="modal"
                data-target="#userApproval"
                style={{
                  width: "6.5rem",
                  height: "2.5rem",
                  alignSelf: "center",
                  border: "none",
                  outline: "none",
                  visibility: "hidden",
                  position: "absolute",
                }}
                onClick={() => {
                  approveUserId = user._id;
                }}
              >
                {" "}
                <i className="fas fa-user-check">Approve</i>
              </button>
            </div>
          )}

          {user.approved == false && (
            <button
              className="mb-2 btn-success rounded"
              data-toggle="modal"
              data-target="#userApproval"
              style={{
                width: "6.5rem",
                height: "2.5rem",
                alignSelf: "center",
                border: "none",
                outline: "none",
              }}
              onClick={() => {
                approveUserId = user._id;
              }}
            >
              <i className="fas fa-user-check">Approve</i>
            </button>
          )}

          <div
            className="modal fade"
            id="userApproval"
            tabindex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content card">
                <p
                  style={{
                    alignSelf: "center",
                    fontSize: "25px",
                    marginTop: "1rem",
                  }}
                >
                  Sure to approve?
                </p>
                <div className="modal-body">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    style={{ marginLeft: "8.5rem" }}
                    data-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    style={{ marginLeft: "1rem" }}
                    type="submit"
                    className="btn btn-outline-success"
                    onClick={() => {
                      handleUserApproval();
                    }}
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApproveUsers;
