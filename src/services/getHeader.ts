import Cookies from "js-cookie";

// You can define a helper function to get the headers, assuming it's required in multiple places
export const getHeaders = (): Record<string, string> | undefined => {
  let cookie = Cookies.get("token");
  if (cookie)
    return {
      Authorization: `Bearer ${Cookies.get("token") || ""}`,
    };
  return undefined;
};
