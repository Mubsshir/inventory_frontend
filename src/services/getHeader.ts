import Cookies from "js-cookie";

// You can define a helper function to get the headers, assuming it's required in multiple places
export const getHeaders = (): Record<string, string> => {
  return {
    Authorization: `Bearer ${Cookies.get("token") || ""}`,
  };
};
