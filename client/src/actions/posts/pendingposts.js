require("dotenv").config();
export const pendingPostsActions = (token) => {
  const response = fetch(
    `${process.env.REACT_APP_SERVER_URL}/api/posts/pending`,
    {
      headers: {
        Accept: "application/json",
        "auth-token": `${token}`,
      },
      method: "GET",
    }
  ).then((res) => {
    return res.json();
  });
  return response;
};
