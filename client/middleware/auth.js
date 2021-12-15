import Cookies from "js-cookie";

export const setCookie = (key, value) => {
  if (process.browser) {
    Cookies.set(key, value, { expires: 7 });
  }
};

export const getCookie = (key) => {
  if (process.browser) {
    return Cookies.get(key);
  }
};

// export const authenticated = (data, next) => {
//   setCookie("token", data);
//   // console.log(data);
//   // next();
// };
