import React, { useEffect, useState, Fragment } from "react";
import { isToken } from "../../actions/auth";

const ViewAssignment = () => {
  const postID = window.location.href.substring(
    window.location.href.indexOf("/loc/") + 5,
    window.location.href.indexOf("/view")
  );

  const [post, setPost] = useState({});

  const token = isToken();

  let index = 1;

  const getPost = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/posts/view-post/${postID}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": `${token}`,
      },
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setPost(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getPost();
  }, []);

  return (
    <Fragment>
      {post === "Not Found" && (
        <div className="card mt-2" style={{ border: "none" }}>
          <h1 style={{ fontWeight: "100" }}>
            post does not exists <br />
            anymore
          </h1>
        </div>
      )}
      {post !== "Not Found" && (
        <div className="card mt-2">
          {post.photo && (
            <div className="text-center">
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
          {post.photos && (
            <div style={{ backgroundColor: "#f5f5f0" }}>
              <p className="text-center">{post.text}</p>
              {post.photos.map((i) => (
                <div className="card mt-2" key={i}>
                  <img
                    style={{
                      width: "22rem",
                      height: "20rem",
                      alignSelf: "center",
                    }}
                    src={`${process.env.REACT_APP_SERVER_URL}/api/posts/get-images/${postID}/${index}`}
                  />
                  {(index = index + 1) - 1}
                </div>
              ))}
            </div>
          )}
          {!post.photo && !post.pdfdocument && !post.photos && (
            <div className="card" style={{ backgroundColor: "#f5f5f0" }}>
              <div className="card-body bg-white">
                <p className="text-center mt-3">{post.text}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </Fragment>
  );
};

export default ViewAssignment;
