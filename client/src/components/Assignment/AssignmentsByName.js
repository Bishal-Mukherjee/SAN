import React, { Fragment, useEffect, useState } from "react";
import { isToken } from "../../actions/auth";
import { isAuth } from "../../actions/auth";
import { postsByNameActions } from "../../actions/posts/postbyname";
import { getFacultyMembersActions } from "../../actions/users/facultymembers";
import userImage from "../../assets/userImage.png";
import "../../App.css";
import { useHistory } from "react-router";
import { toast, ToastContainer } from "react-toastify";
require("dotenv").config();

const AssignmentsByName = () => {
  const [values, setValues] = useState({
    userName: "",
    text: "",
  });

  const [posts, setPosts] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const history = useHistory();

  const { userName, text } = values;
  const token = isToken();
  let postToBeDeleted;

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    postsByNameActions(userName).then((data) => {
      if (data !== "NULL") {
        setPosts(data);
      } else {
        setPosts(null);
      }
    });
  };

  const handleDoubtsDropdown = (postID) => {
    if (document.getElementById(`${postID}`)) {
      if (document.getElementById(`${postID}`).style.visibility === "hidden") {
        document.getElementById(`${postID}`).style.visibility = "visible";
        document.getElementById(`${postID}`).style.height = "1.8rem";
      } else {
        document.getElementById(`${postID}`).style.visibility = "hidden";
        document.getElementById(`${postID}`).style.height = "0";
      }
    }
  };

  const deletePost = (postID) => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/posts/delete/${postID}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": `${token}`,
      },
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        toast.success("deleted successfully");
        setTimeout(function () {
          window.location.reload();
        }, 1000);
      });
  };

  const getFacultyName = () => {
    getFacultyMembersActions().then((data) => setFaculty(data));
  };

  useEffect(() => {
    getFacultyName();
  }, []);

  return (
    <Fragment>
      <div className="mt-3">
        <form className="form" onSubmit={(e) => handleSubmit(e)}>
          <select
            name="userName"
            style={{ width: "12rem", outline: "none", height: "2.1rem" }}
            onChange={(e) => handleChange(e)}
          >
            <option value="">-- Select Faculty --</option>
            {faculty.map((f) => (
              <option value={`${f}`}>{`${f}`}</option>
            ))}
          </select>
          <button
            id="find-button"
            type="submit"
            className="ml-2"
            style={{
              height: "2rem",
              borderWidth: "1px",
              width: "2.5rem",
            }}
          >
            <i className="fas fa-search"></i>
          </button>
        </form>
        <div className="mt-2">
          {(!posts || posts.length === 0) && (
            <div className="card" style={{ border: "none" }}>
              <p style={{ fontSize: "25px", fontWeight: "100" }}>
                No posts found
              </p>
            </div>
          )}
          {posts &&
            posts.map(
              (post, i) =>
                post.institution === isAuth().institution &&
                post.department === isAuth().department && (
                  <div
                    key={i}
                    className="card mt-2 class-stories-card"
                    style={{ backgroundColor: "#f5f5f0" }}
                  >
                    <div className="card-body card">
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
                            onClick={() => (postToBeDeleted = post._id)}
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
                                      onClick={() =>
                                        deletePost(postToBeDeleted)
                                      }
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

                      {!post.photo &&
                        !post.pdfdocument &&
                        post.photos.length === 0 && (
                          <div>
                            <div
                              className="card"
                              style={{
                                border: "none",
                                marginBottom: "",
                              }}
                            >
                              <p className="text-center mt-3">{post.text}</p>
                              <div
                                className="mt-5"
                                style={{
                                  alignSelf: "center",
                                  backgroundColor: "#f5f5f0",
                                }}
                              >
                                <button
                                  style={{
                                    backgroundColor: "#f5f5f0",
                                    border: "none",
                                  }}
                                  onClick={() => {
                                    history.push(`/loc/doubts/${post._id}`);
                                  }}
                                >
                                  <i className="fas fa-comments fa-lg"></i>
                                  Doubts {post.doubts.length}
                                </button>
                                <button
                                  className="ml-4"
                                  style={{
                                    border: "none",
                                    backgroundColor: "#f5f5f0",
                                  }}
                                  onClick={() => {
                                    handleDoubtsDropdown(post._id);
                                  }}
                                >
                                  <i className="fas fa-pen-square fa-lg"></i>{" "}
                                  Ask doubt
                                </button>
                              </div>

                              {window.innerWidth <= 500 &&
                                window.innerWidth < 600 && (
                                  <div
                                    id={`${post._id}`}
                                    style={{
                                      visibility: "hidden",
                                      height: "0",
                                    }}
                                  >
                                    <form
                                      onSubmit={(e) =>
                                        handleSubmit(e, post._id)
                                      }
                                    >
                                      <input
                                        name="text"
                                        value={text}
                                        onChange={(e) => handleChange(e)}
                                        placeholder="Write your doubts.."
                                        style={{
                                          outline: "none",
                                          width: "82%",
                                          borderRadius: "1rem",
                                          borderWidth: "0.1rem",
                                        }}
                                        required
                                      />
                                      <button
                                        type="submit"
                                        style={{
                                          backgroundColor: "white",
                                          border: "none",
                                        }}
                                      >
                                        <i className="fas fa-paper-plane"></i>
                                      </button>
                                    </form>
                                  </div>
                                )}

                              {window.innerWidth >= 600 &&
                                window.innerWidth >= 1048 && (
                                  <div
                                    id={`${post._id}`}
                                    style={{
                                      visibility: "hidden",
                                      height: "0",
                                    }}
                                  >
                                    <form
                                      onSubmit={(e) =>
                                        handleSubmit(e, post._id)
                                      }
                                    >
                                      <input
                                        name="text"
                                        value={text}
                                        onChange={(e) => handleChange(e)}
                                        placeholder="Write your doubts.."
                                        style={{
                                          outline: "none",
                                          width: "96%",
                                          marginLeft: "1rem",
                                          borderRadius: "1rem",
                                        }}
                                        required
                                      />
                                      <button
                                        type="submit"
                                        style={{
                                          backgroundColor: "white",
                                          border: "none",
                                        }}
                                      >
                                        <i className="fas fa-paper-plane"></i>
                                      </button>
                                    </form>
                                  </div>
                                )}
                            </div>
                          </div>
                        )}

                      {post.photo && (
                        <div className="card">
                          <img
                            style={{
                              width: "15rem",
                              height: "15rem",
                              alignSelf: "center",
                            }}
                            className="mt-2"
                            src={`${process.env.REACT_APP_SERVER_URL}/api/posts/view_photo/${post._id}`}
                          />
                          <p className="text-center">{post.text}</p>

                          <div
                            style={{
                              alignSelf: "center",
                              backgroundColor: "#f5f5f0",
                            }}
                          >
                            <button
                              style={{
                                backgroundColor: "#f5f5f0",
                                border: "none",
                              }}
                              onClick={() => {
                                history.push(`/loc/doubts/${post._id}`);
                              }}
                            >
                              <i className="fas fa-comments fa-lg"></i>
                              Doubts {post.doubts.length}
                            </button>
                            <button
                              className="ml-4"
                              style={{
                                border: "none",
                                backgroundColor: "#f5f5f0",
                              }}
                              onClick={() => {
                                handleDoubtsDropdown(post._id);
                              }}
                            >
                              <i className="fas fa-pen-square fa-lg"></i> Ask
                              doubt
                            </button>
                          </div>

                          {window.innerWidth <= 500 && window.innerWidth < 600 && (
                            <div
                              id={`${post._id}`}
                              style={{ visibility: "hidden", height: "0" }}
                            >
                              <form onSubmit={(e) => handleSubmit(e, post._id)}>
                                <input
                                  name="text"
                                  value={text}
                                  onChange={(e) => handleChange(e)}
                                  placeholder="Write your doubts.."
                                  style={{
                                    outline: "none",
                                    width: "82%",
                                    borderRadius: "1rem",
                                  }}
                                  required
                                />
                                <button
                                  type="submit"
                                  style={{
                                    backgroundColor: "white",
                                    border: "none",
                                  }}
                                >
                                  <i className="fas fa-paper-plane"></i>
                                </button>
                              </form>
                            </div>
                          )}

                          {window.innerWidth >= 600 &&
                            window.innerWidth >= 1048 && (
                              <div
                                id={`${post._id}`}
                                style={{ visibility: "hidden", height: "0" }}
                              >
                                <form
                                  onSubmit={(e) => handleSubmit(e, post._id)}
                                >
                                  <input
                                    name="text"
                                    value={text}
                                    onChange={(e) => handleChange(e)}
                                    placeholder="Write your doubts.."
                                    style={{
                                      outline: "none",
                                      width: "96%",
                                      marginLeft: "1rem",
                                      borderRadius: "1rem",
                                    }}
                                    required
                                  />
                                  <button
                                    type="submit"
                                    style={{
                                      backgroundColor: "white",
                                      border: "none",
                                    }}
                                  >
                                    <i className="fas fa-paper-plane"></i>
                                  </button>
                                </form>
                              </div>
                            )}
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
                          <div
                            style={{
                              alignSelf: "center",
                              backgroundColor: "#f5f5f0",
                            }}
                          >
                            <button
                              style={{
                                backgroundColor: "#f5f5f0",
                                border: "none",
                              }}
                              onClick={() => {
                                history.push(`/loc/doubts/${post._id}`);
                              }}
                            >
                              <i className="fas fa-comments fa-lg"></i>
                              Doubts {post.doubts.length}
                            </button>
                            <button
                              className="ml-4"
                              style={{
                                border: "none",
                                backgroundColor: "#f5f5f0",
                              }}
                              onClick={() => {
                                handleDoubtsDropdown(post._id);
                              }}
                            >
                              <i className="fas fa-pen-square fa-lg"></i> Ask
                              doubt
                            </button>
                          </div>

                          {window.innerWidth <= 500 && window.innerWidth < 600 && (
                            <div
                              id={`${post._id}`}
                              style={{ visibility: "hidden", height: "0" }}
                            >
                              <form onSubmit={(e) => handleSubmit(e, post._id)}>
                                <input
                                  name="text"
                                  value={text}
                                  onChange={(e) => handleChange(e)}
                                  placeholder="Write your doubts.."
                                  style={{
                                    outline: "none",
                                    width: "82%",
                                    borderRadius: "1rem",
                                  }}
                                  required
                                />
                                <button
                                  type="submit"
                                  style={{
                                    backgroundColor: "white",
                                    border: "none",
                                  }}
                                >
                                  <i className="fas fa-paper-plane"></i>
                                </button>
                              </form>
                            </div>
                          )}

                          {window.innerWidth >= 600 &&
                            window.innerWidth >= 1048 && (
                              <div
                                id={`${post._id}`}
                                style={{ visibility: "hidden", height: "0" }}
                              >
                                <form
                                  onSubmit={(e) => handleSubmit(e, post._id)}
                                >
                                  <input
                                    name="text"
                                    value={text}
                                    onChange={(e) => handleChange(e)}
                                    placeholder="Write your doubts.."
                                    style={{
                                      outline: "none",
                                      width: "96%",
                                      marginLeft: "1rem",
                                      borderRadius: "1rem",
                                    }}
                                    required
                                  />
                                  <button
                                    type="submit"
                                    style={{
                                      backgroundColor: "white",
                                      border: "none",
                                    }}
                                  >
                                    <i className="fas fa-paper-plane"></i>
                                  </button>
                                </form>
                              </div>
                            )}
                        </div>
                      )}

                      {post.photos.length !== 0 && (
                        <div className="card">
                          <img
                            style={{
                              width: "15rem",
                              height: "15rem",
                              alignSelf: "center",
                            }}
                            className="mt-2"
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
                              Click to view all
                            </a>
                          </div>
                          <div
                            style={{
                              alignSelf: "center",
                              backgroundColor: "#f5f5f0",
                            }}
                          >
                            <button
                              style={{
                                backgroundColor: "#f5f5f0",
                                border: "none",
                              }}
                              onClick={() => {
                                history.push(`/loc/doubts/${post._id}`);
                              }}
                            >
                              <i className="fas fa-comments fa-lg"></i>
                              Doubts {post.doubts.length}
                            </button>
                            <button
                              className="ml-4"
                              style={{
                                border: "none",
                                backgroundColor: "#f5f5f0",
                              }}
                              onClick={() => {
                                handleDoubtsDropdown(post._id);
                              }}
                            >
                              <i className="fas fa-pen-square fa-lg"></i> Ask
                              doubt
                            </button>
                          </div>

                          {window.innerWidth <= 500 && window.innerWidth < 600 && (
                            <div
                              id={`${post._id}`}
                              style={{ visibility: "hidden", height: "0" }}
                            >
                              <form onSubmit={(e) => handleSubmit(e, post._id)}>
                                <input
                                  name="text"
                                  value={text}
                                  onChange={(e) => handleChange(e)}
                                  placeholder="Write your doubts.."
                                  style={{
                                    outline: "none",
                                    width: "82%",
                                    borderRadius: "1rem",
                                  }}
                                  required
                                />
                                <button
                                  type="submit"
                                  style={{
                                    backgroundColor: "white",
                                    border: "none",
                                  }}
                                >
                                  <i className="fas fa-paper-plane"></i>
                                </button>
                              </form>
                            </div>
                          )}

                          {window.innerWidth >= 600 &&
                            window.innerWidth >= 1048 && (
                              <div
                                id={`${post._id}`}
                                style={{ visibility: "hidden", height: "0" }}
                              >
                                <form
                                  onSubmit={(e) => handleSubmit(e, post._id)}
                                >
                                  <input
                                    name="text"
                                    value={text}
                                    onChange={(e) => handleChange(e)}
                                    placeholder="Write your doubts.."
                                    style={{
                                      outline: "none",
                                      width: "96%",
                                      marginLeft: "1rem",
                                      borderRadius: "1rem",
                                    }}
                                    required
                                  />
                                  <button
                                    type="submit"
                                    style={{
                                      backgroundColor: "white",
                                      border: "none",
                                    }}
                                  >
                                    <i className="fas fa-paper-plane"></i>
                                  </button>
                                </form>
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                    <p className="m-2">{post.date.substring(0, 10)}</p>

                    {isAuth().designation === "HOD" ||
                      (isAuth().designation === "Faculty" && (
                        <div className="ml-2">
                          <p>
                            {post.department} -- {post.year}
                            <br />
                            {post.institution}
                          </p>
                        </div>
                      ))}
                  </div>
                )
            )}
        </div>
      </div>
      <ToastContainer />
    </Fragment>
  );
};

export default AssignmentsByName;
