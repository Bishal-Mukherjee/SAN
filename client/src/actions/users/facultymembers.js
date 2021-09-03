import { isToken } from "../auth";
require("dotenv").config();
export const getFacultyMembersActions = () => {
  const token = isToken();
  const response = fetch(
    `${process.env.REACT_APP_SERVER_URL}/api/users/faculty_members`,
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
