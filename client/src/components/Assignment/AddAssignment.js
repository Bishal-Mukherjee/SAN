import React, { useState } from "react";
import { Fragment } from "react";
import { toast, ToastContainer } from "react-toastify";
import FormData from "form-data";
import { useHistory } from "react-router-dom";
import { isAuth } from "../../actions/auth";
import { isToken } from "../../actions/auth";

const AddAssignment = () => {
  const history = useHistory();

  const [values, setValues] = useState({});

  const token = isToken();

  const allHidden = () => {
    document.getElementById("singleImage").style.visibility = "hidden";
    document.getElementById("multipleImage").style.visibility = "hidden";
    document.getElementById("pdf").style.visibility = "hidden";
    document.getElementById("only-text").style.visibility = "hidden";
  };

  const handleSingleImage = () => {
    if (document.getElementById("singleImage").style.visibility === "hidden") {
      document.getElementById("multiple-image").checked = false;
      document.getElementById("pdf-input").checked = false;
      document.getElementById("text-input").checked = false;
      allHidden();
      document.getElementById("singleImage").style.visibility = "visible";
    } else {
      allHidden();
    }
  };

  const handleMultipleImage = () => {
    if (
      document.getElementById("multipleImage").style.visibility === "hidden"
    ) {
      document.getElementById("single-image").checked = false;
      document.getElementById("pdf-input").checked = false;
      document.getElementById("text-input").checked = false;
      allHidden();
      document.getElementById("multipleImage").style.visibility = "visible";
    } else {
      allHidden();
    }
  };

  const handlePdf = () => {
    if (document.getElementById("pdf").style.visibility === "hidden") {
      document.getElementById("multiple-image").checked = false;
      document.getElementById("single-image").checked = false;
      document.getElementById("text-input").checked = false;
      allHidden();
      document.getElementById("pdf").style.visibility = "visible";
    } else {
      allHidden();
    }
  };

  const handleText = () => {
    if (document.getElementById("only-text").style.visibility === "hidden") {
      document.getElementById("multiple-image").checked = false;
      document.getElementById("single-image").checked = false;
      document.getElementById("pdf-input").checked = false;
      allHidden();
      document.getElementById("only-text").style.visibility = "visible";
    } else {
      allHidden();
    }
  };

  const [userData, setUserData] = useState(new FormData());

  const handleChange = (name) => (e) => {
    let value = name === "photos" ? Array.from(e.target.files) : e.target.value;

    if (name === "photos") {
      value.forEach((photo) => userData.append("photos", photo));
    } else {
      if (name === "photo") {
        value = name === "photo" ? e.target.files[0] : e.target.value;
      }
      if (name === "pdf") {
        value = name === "pdf" ? e.target.files[0] : e.target.value;
      }
      userData.set(name, value);
    }
    setValues({ ...values, error: "", success: "", [name]: value });
    setUserData(userData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${process.env.REACT_APP_SERVER_URL}/api/posts`, {
      headers: {
        "auth-token": `${token}`,
      },
      method: "POST",
      body: userData,
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("added successfully");
      })
      .catch((err) => console.log(err));
  };
  return (
    <Fragment>
      {isAuth() && (
        <div className="mt-2">
          <input
            type="checkbox"
            id="single-image"
            className="mr-2"
            style={{ cursor: "pointer" }}
            onClick={handleSingleImage}
          />
          <label style={{ fontWeight: "500" }}>Single Image and Text</label>
          <br />
          <input
            type="checkbox"
            id="multiple-image"
            className="mr-2 btn btn-outline-secondary"
            onClick={handleMultipleImage}
          />
          <label style={{ fontWeight: "500" }}>Multiple Images and Text</label>
          <br />
          <input
            type="checkbox"
            id="pdf-input"
            className="mr-2 btn btn-outline-secondary"
            onClick={handlePdf}
          />
          <label style={{ fontWeight: "500" }}>Pdf and Text</label>
          <br />
          <input
            type="checkbox"
            id="text-input"
            style={{ color: "" }}
            className="mr-2 btn btn-outline-secondary"
            onClick={handleText}
          />
          <label style={{ fontWeight: "500" }}>Text Only</label>
          <form onSubmit={(e) => handleSubmit(e)}>
            {isAuth().designation != "HOD" && (
              <div>
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
                  style={{ width: "12rem", height: "2rem" }}
                  name="department"
                  onChange={handleChange("department")}
                  required
                >
                  <option value="">-- Select Department --</option>
                  <option value="BCA">BCA</option>
                  <option value="BSc. Compouter Science">
                    BSc. Computer Science
                  </option>
                  <option value="BBA">BBA</option>
                  <option value="English">English</option>
                </select>
                <br />
              </div>
            )}

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
              style={{ width: "12rem", height: "2rem" }}
              name="year"
              onChange={handleChange("year")}
              required
            >
              <option value="">-- Select Year --</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
            </select>

            <br />

            {/* single image and text */}
            <div
              id="singleImage"
              style={{ visibility: "hidden", marginTop: "0.5rem" }}
            >
              assignment: <br />
              <textarea
                style={{ outline: "none" }}
                name="text"
                onChange={handleChange("text")}
                placeholder="Write something.."
                cols="40"
              />
              <br />
              <input
                onChange={handleChange("photo")}
                type="file"
                accept="image/*"
              />
            </div>

            {/* multiple images and text */}
            <div
              id="multipleImage"
              style={{
                visibility: "hidden",
                marginTop: "-5rem",
              }}
            >
              assignment: <br />
              <textarea
                style={{ outline: "none" }}
                name="text"
                onChange={handleChange("text")}
                placeholder="Write something.."
                cols="40"
              />
              <br />
              <input
                name="photos"
                onChange={handleChange("photos")}
                multiple
                type="file"
                accept="images/*"
              />
            </div>

            {/* pdf and text */}
            <div
              id="pdf"
              style={{
                visibility: "hidden",
                marginTop: "-10rem",
              }}
            >
              assignment: <br />
              <textarea
                name="text"
                style={{ outline: "none" }}
                onChange={handleChange("text")}
                placeholder="Write something.."
                cols="40"
              />
              <br />
              <input
                name="pdf"
                onChange={handleChange("pdf")}
                type="file"
                accept="pdf"
              />
            </div>

            {/* only text */}
            <div
              id="only-text"
              style={{
                visibility: "hidden",
                marginTop: "-7rem",
                position: "fixed",
              }}
            >
              assignment: <br />
              <textarea
                name="text"
                style={{ outline: "none" }}
                onChange={handleChange("text")}
                placeholder="Write something.."
                cols="40"
                required
              />
            </div>
            <button
              className="btn btn-primary"
              style={{ position: "absolute", marginTop: "3rem" }}
            >
              Add
            </button>
          </form>
        </div>
      )}
      {!isAuth() && history.push("/")}
      <ToastContainer />
    </Fragment>
  );
};

export default AddAssignment;
