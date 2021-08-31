require("dotenv").config();
export const resetPassword = (emailID, password, confirmPassword) => {
  const response = fetch(
    `${process.env.REACT_APP_SERVER_URL}/api/users/reset-password/${emailID}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({ password, confirmPassword }),
    }
  ).then((res) => {
    return res;
  });

  return response;
};
