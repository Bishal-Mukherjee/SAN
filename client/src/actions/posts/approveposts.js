require("dotenv").config();

export const approvePostsActions = (postID, token) => {
  const response = fetch(
    `${process.env.REACT_APP_SERVER_URL}/api/posts/approve/${postID}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": `${token}`,
      },
      method: "PUT",
    }
  ).then((res) => {
    return res.json();
  });

  return response;
};