require("dotenv").config();

export const removeOTP = (emailID) => {
  fetch(`${process.env.REACT_APP_SERVER_URL}/api/users/remove-otp/${emailID}`, {
    headers: {
      Accept: "application/json",
    },
    method: "GET",
  });
};
