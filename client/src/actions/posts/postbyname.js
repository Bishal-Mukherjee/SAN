import { isToken } from "../auth";
require("dotenv").config();

export const postsByNameActions = (userName) => {
  const token = isToken();
  const response = fetch(
    `${process.env.REACT_APP_SERVER_URL}/api/posts/${userName}/posts`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": `${token}`,
      },
      method: "GET",
    }
  ).then((res) => {
    return res.json();
  });

  return response;
};
