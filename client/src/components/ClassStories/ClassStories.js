import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { isAuth, isToken } from "../../actions/auth";
import { deletePostActions } from "../../actions/posts/deleteposts";
import userImage from "../../assets/userImage.png";
require("dotenv").config();

const ClassStories = () => {
  const token = isToken();
  const history = useHistory();
  const [posts, setPosts] = useState([]);
  const [values, setValues] = useState({
    text: "",
  });

  const { text } = values;

  let postToBeDeleted;

  const getStories = async () => {
    await fetch(`${process.env.REACT_APP_SERVER_URL}/api/posts`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": `${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.log(err));
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
    deletePostActions(postID, token).then((data) => {
      toast.success("deleted");
      setTimeout(function () {
        window.location.reload();
      }, 1000);
    });
  };

  // const handleSingleDoubtsDropdown = (postID) => {
  //   if (document.getElementById(`${postID}`).style.visibility === "hidden") {
  //     document.getElementById(`${postID}`).style.visibility = "visible";
  //     document.getElementById(`${postID}`).style.height = "1.8rem";
  //   } else {
  //     document.getElementById(`${postID}`).style.visibility = "hidden";
  //     document.getElementById(`${postID}`).style.height = "0";
  //   }
  // };

  // const handleMultipleDoubtsDropdown = (postID) => {
  //   console.log(postID);
  //   if (document.getElementById(`${postID}`)) {
  //     if (document.getElementById(`${postID}`).style.visibility === "hidden") {
  //       document.getElementById(`${postID}`).style.visibility = "visible";
  //       document.getElementById(`${postID}`).style.height = "1.8rem";
  //     } else {
  //       document.getElementById(`${postID}`).style.visibility = "hidden";
  //       document.getElementById(`${postID}`).style.height = "0";
  //     }
  //   }
  // };

  // const handlePdfDoubtsDropdown = (postID) => {
  //   if (document.getElementById(`${postID}`).style.visibility === "hidden") {
  //     document.getElementById(`${postID}`).style.visibility = "visible";
  //     document.getElementById(`${postID}`).style.height = "1.8rem";
  //   } else {
  //     document.getElementById(`${postID}`).style.visibility = "hidden";
  //     document.getElementById(`${postID}`).style.height = "0";
  //   }
  // };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e, postID) => {
    e.preventDefault();
    await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/posts/${postID}/write-doubts`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "auth-token": `${token}`,
        },
        method: "PUT",
        body: JSON.stringify({ text }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        toast.success("doubt added");
        getStories();
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getStories();
  }, []);

  return (
    <Fragment>
      {token && (
        <div>
          {posts.map(
            (post, i) =>
              post.institution === isAuth().institution && (
                <div
                  key={i}
                  className="card mt-4"
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
                                    onClick={() => deletePost(postToBeDeleted)}
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
                                <i className="fas fa-pen-square fa-lg"></i> Ask
                                doubt
                              </button>
                            </div>

                            {window.innerWidth <= 500 &&
                              window.innerWidth < 600 && (
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

                        {window.innerWidth >= 600 && window.innerWidth >= 1048 && (
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

                        {window.innerWidth >= 600 && window.innerWidth >= 1048 && (
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

                        {window.innerWidth >= 600 && window.innerWidth >= 1048 && (
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
      )}
      {!token && history.push("/")}
      <ToastContainer />
    </Fragment>
  );
};

export default ClassStories;
