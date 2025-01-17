import Cookies from "js-cookie";

export const getHeaders = () => {
    let token = Cookies.get("token");
    const headers = {
      authorization: `Bearer ${token}`,
    };
    return headers;
  };
  