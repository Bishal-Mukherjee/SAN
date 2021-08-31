require("dotenv").config();
export const deletePostActions = (postID, token) => {
  const response = fetch(
    `${process.env.REACT_APP_SERVER_URL}/api/posts/delete/${postID}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": `${token}`,
      },
      method: "DELETE",
    }
  ).then((res) => {
    return res;
  });

  return response;
};

export const deleteNotificationsActions = (postID, token) => {
  fetch(
    `${process.env.REACT_APP_SERVER_URL}/api/posts/${postID}/remove-notification`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": `${token}`,
      },
      method: "GET",
    }
  ).catch((err) => console.log(err));
};
