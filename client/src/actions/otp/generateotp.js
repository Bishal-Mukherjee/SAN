require("dotenv").config();
export const genOtp = (emailID) => {
  const response = fetch(
    `${process.env.REACT_APP_SERVER_URL}/api/users/generate-otp/${emailID}`,
    {
      headers: {
        Accept: "application/json",
      },
      method: "PUT",
    }
  )
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((err) => console.log(err));

  return response;
};
