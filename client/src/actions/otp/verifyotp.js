require("dotenv").config();

export const verifyOTP = (emailID, otp) => {
  const response = fetch(
    `${process.env.REACT_APP_SERVER_URL}/api/users/verify-otp/${emailID}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({ otp }),
    }
  )
    .then((res) => res.json())
    .then((data) => {
      return data;
    });

  return response;
};
