require("dotenv").config();

export const getNotificationsActions = (token) => {
  const response = fetch(
    `${process.env.REACT_APP_SERVER_URL}/api/posts/notifications`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": `${token}`,
      },
      method: "GET",
    }
  )
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.log(err));

  return response;
};

export const deleteNotificationsActions = (token) => {
  const response = fetch(
    `${process.env.REACT_APP_SERVER_URL}/api/posts/delete-notifications`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": `${token}`,
      },
      method: "DELETE",
    }
  ).then((res) => {
    return res.json();
  });

  return response;
};
