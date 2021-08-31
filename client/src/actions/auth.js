import Cookies from "js-cookie";

export const isAuth = () => {
  if (localStorage.getItem("token")) {
    if (localStorage.getItem("user")) {
      return JSON.parse(localStorage.getItem("user"));
    } else return false;
  } else return false;
};

export const isToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return token;
  } else return false;
};

export const loginActions = (user, token) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
};

export const logoutActions = () => {
  Cookies.remove("token");
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};
