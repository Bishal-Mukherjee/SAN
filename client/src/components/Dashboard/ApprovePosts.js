import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { useHistory } from "react-router-dom";
import { isAuth } from "../../actions/auth";
import { isToken } from "../../actions/auth";
import { approvePostsActions } from "../../actions/posts/approveposts";
import { pendingPostsActions } from "../../actions/posts/pendingposts";
import userImage from "../../assets/userImage.png";
require("dotenv").config();

const ApprovePosts = () => {
  const history = useHistory();
  const token = isToken();
  const [pendingPosts, setPendingPosts] = useState([]);
  let approvePostID;

  /* get the pending post, with an approve button */
  const getPendingPosts = async () => {
    pendingPostsActions(token)
      .then((data) => setPendingPosts(data))
      .catch((err) => console.log(err));
  };

  /* create approval request */
  const handleApproval = async (postID) => {
    approvePostsActions(postID, token).then((data) => {
      setTimeout(function () {
        window.location.reload();
      }, 1000);
    });
  };

  useEffect(() => {
    getPendingPosts();
  }, []);

  return (
    <Fragment>
      {isAuth().designation === "Admin" && (
        <div>
          {pendingPosts.map((post, i) => (
            <div
              className="card mt-4"
              style={{ backgroundColor: "#f5f5f0" }}
              key={i}
            >
              <div className="card-body">
                <img
                  src={userImage}
                  style={{
                    width: "2rem",
                    borderRadius: "1rem",
                    marginLeft: "1rem",
                  }}
                />
                <p className="ml-2">{post.name}</p>

                {post.photo && (
                  <div className="card">
                    <img
                      style={{
                        width: "15rem",
                        height: "15rem",
                        alignSelf: "center",
                      }}
                      src={`${process.env.REACT_APP_SERVER_URL}/api/posts/view_photo/${post._id}`}
                    />
                    <p className="text-center">{post.text}</p>
                  </div>
                )}

                {!post.photo && !post.pdfdocument && post.photos.length === 0 && (
                  <div className="card">
                    <div className="card-body" style={{ backgroundColor: "" }}>
                      <p className="text-center mt-3">{post.text}</p>
                    </div>
                  </div>
                )}

                {post.pdfdocument && (
                  <div className="card">
                    <embed
                      style={{
                        width: "15rem",
                        height: "15rem",
                        alignSelf: "center",
                        marginTop: "1rem",
                      }}
                      src={`${process.env.REACT_APP_SERVER_URL}/api/posts/view-pdf/${post._id}`}
                    />
                    <a
                      className="btn mt-2"
                      href={`${process.env.REACT_APP_SERVER_URL}/api/posts/view-pdf/${post._id}`}
                      style={{
                        width: "8rem",
                        alignSelf: "center",
                      }}
                      download
                    >
                      <i className="fas fa-arrow-down"></i> Download
                    </a>
                    <p className="text-center">{post.text}</p>
                  </div>
                )}

                {post.photos.length !== 0 && (
                  <div className="card">
                    <img
                      style={{
                        width: "15rem",
                        height: "15rem",
                        alignSelf: "center",
                        marginTop: "1rem",
                      }}
                      src={`${
                        process.env.REACT_APP_SERVER_URL
                      }/api/posts/get-images/${post._id}/${1}`}
                    />
                    <p className="text-center">
                      {post.text}
                      <br />
                      1/{post.photos.length}
                    </p>
                    <a
                      style={{ alignSelf: "center", textDecoration: "none" }}
                      href={`/loc/${post._id}/view`}
                    >
                      Click Me
                    </a>
                  </div>
                )}
              </div>
              <p className="ml-2">{post.date.substring(0, 10)}</p>
              <p style={{ marginLeft: "0.5rem", marginTop: "-0.5rem" }}>
                {post.institution} -- {post.department} -- {post.year}
              </p>

              <button
                className="btn btn-outline-success ml-3 mb-2"
                data-toggle="modal"
                data-target="#approval"
                style={{ width: "6rem" }}
                // onClick={() => handleApproval(post._id)}
                onClick={() => {
                  approvePostID = post._id;
                }}
              >
                <i className="fas fa-check">Approve</i>
              </button>

              <div
                className="modal fade"
                id="approval"
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
                        onClick={() => handleApproval(approvePostID)}
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
      )}
      {isAuth().designation !== "Admin" && history.push("/loc/dashboard")}
    </Fragment>
  );
};

export default ApprovePosts;
