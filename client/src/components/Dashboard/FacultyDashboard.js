import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { toast, ToastContainer } from "react-toastify";
import { isAuth, isToken } from "../../actions/auth";
import userImage from "../../assets/userImage.png";
import { deletePostActions } from "../../actions/posts/deleteposts";
import { pendingPostsActions } from "../../actions/posts/pendingposts";

const FacultyDashboard = () => {
  const token = isToken();
  const [pendingPosts, setPendingPosts] = useState([]);
  const getPendingPosts = () => {
    pendingPostsActions(token)
      .then((data) => {
        setPendingPosts(data);
        document.getElementById("loader").style.visibility = "hidden";
        document.getElementById("loader").style.marginTop = "0px";
        document.getElementById("loader").style.marginLeft = "0px";
        if (data.length !== 0) {
          document.getElementById("no-posts-message").style.visibility =
            "hidden";
        }
        document.getElementById("no-posts-message").style.marginTop = "0px";
      })
      .then((err) => console.log(err));
  };

  let postToBeDeleted;

  const delPost = () => {
    deletePostActions(postToBeDeleted, token)
      .then((data) => {
        toast.success("deleted");
        setTimeout(function () {
          window.location.reload();
        }, 2000);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getPendingPosts();
  }, []);

  return (
    <Fragment>
      <div>
        <div
          id="no-posts-message"
          className="card"
          style={{ border: "none", height: "0px" }}
        >
          <h1 style={{ fontWeight: "100" }}>
            No posts yet by you <br />
          </h1>
        </div>

        <div
          id="loader"
          className="loader"
          style={{
            marginTop: "3rem",
            visibility: "visible",
          }}
        ></div>
        {pendingPosts.map((post, i) => (
          <div className="card class-stories-card mt-3">
            <div
              className="card-body card"
              style={{ backgroundColor: "#f5f5f0" }}
            >
              <img
                src={userImage}
                style={{
                  width: "2rem",
                  borderRadius: "1rem",
                  marginLeft: "1rem",
                }}
              />
              {(post.user === isAuth()._id ||
                isAuth().designation === "Admin") && (
                <div
                  style={{
                    background: "none",
                    alignSelf: "flex-end",
                    border: "none",
                    marginTop: "-1.5rem",
                  }}
                >
                  <button
                    style={{ border: "none", background: "none" }}
                    data-toggle="modal"
                    data-target="#delete-post"
                    onClick={() => {
                      postToBeDeleted = post._id;
                    }}
                  >
                    <i
                      className="fas fa-trash"
                      style={{
                        color: "red",
                      }}
                    ></i>
                  </button>
                  <div
                    className="modal fade"
                    id="delete-post"
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
                        <div
                          className="modal-body card"
                          style={{ borderColor: "white" }}
                        >
                          <p
                            style={{
                              alignSelf: "center",
                              fontSize: "30px",
                              marginTop: "-2rem",
                            }}
                          >
                            Sure to delete?
                          </p>
                          <div style={{ alignSelf: "center" }}>
                            <button
                              data-dismiss="modal"
                              className="btn btn-outline-secondary mt-2 mr-3"
                            >
                              Cancel
                            </button>
                            <button
                              className="btn btn-outline-danger mt-2"
                              onClick={() => delPost()}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <p className="ml-2">{post.name}</p>

              {!post.photo && !post.pdfdocument && post.photos.length === 0 && (
                <div className="card">
                  <div className="card-body">
                    <p className="text-center mt-3">{post.text}</p>
                  </div>
                </div>
              )}

              {post.photo && (
                <div className="card">
                  <img
                    className="mt-1"
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

              {post.pdfdocument && (
                <div className="card">
                  <a
                    className="btn mt-2"
                    href={`${process.env.REACT_APP_SERVER_URL}/api/posts/view-pdf/${post._id}`}
                    style={{
                      width: "8rem",
                      alignSelf: "center",
                    }}
                    download
                  >
                    <i className="fas fa-arrow-down btn btn-secondary">
                      Download PDF
                    </i>{" "}
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
                  <p className="text-center">{post.text}</p>
                  <div className="text-center mb-2">
                    <p>1/{post.photos.length}</p>
                    <a
                      style={{ textDecoration: "none" }}
                      href={`/loc/${post._id}/view`}
                    >
                      Click to view
                    </a>
                  </div>
                </div>
              )}
              <p>
                {post.department} -- {post.year}
                <br />
                {post.date.substring(0, 10)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer />
    </Fragment>
  );
};

export default FacultyDashboard;
