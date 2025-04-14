// Assuming BACK_API URL is coming from environment variables
const BACK_API: string = import.meta.env.VITE_API_URL; // URL of backend
import { userData } from "@/store/Store";
import Cookies from "js-cookie";
import { getHeaders } from "./getHeader";

// Define the types for the responses and data structures you'll be working with

type AuthResponse = {
  status: string;
  message: string;
  token?: string;
  userData?: userData;
};

type LoginPayload = {
  user: string;
  pass: string;
};

export const authenticateUser = async (
  username: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const payload: LoginPayload = { user: username, pass: password }; // keyname cannot be changed as server expects key name like this only
    const res = await fetch(`${BACK_API}/login`, {
      method: "POST",
      headers: { ...getHeaders(), "Content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) {
      if (data.status && data.status === "success") {
        Cookies.set("token", data.token || "");
      }

      return {
        status: data.status,
        message: data.message,
        userData: data.user,
      };
    } else {
      return { status: "401", message: "Unauthorized, Please login again." };
    }
  } catch (err) {
    console.error(err);
    return { status: "401", message: "Session Expired, Please Login Again." };
  }
};

export const isUserAuthorized = async (): Promise<AuthResponse> => {
  try {
    const res = await fetch(`${BACK_API}/authenticate`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (res.status === 401) {
      return { status: "401", message: "Unauthorized, Please login again." };
    }

    if (res.ok) {
      const data = await res.json();
      return {
        status: "success",
        message: "Authorization Success",
        userData: data.user,
      };
    } else {
      return { status: "error", message: "Something went wrong" };
    }
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Unknown error",
    };
  }
};

export const logoutUser = async (): Promise<AuthResponse> => {
  try {
    const res = await fetch(`${BACK_API}/logout`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (res.status === 401) {
      return { status: "401", message: "Unauthorized, Please login again." };
    }

    if (res.ok) {
      return await res.json();
    } else {
      return { status: "error", message: "Something went wrong" };
    }
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Unknown error",
    };
  }
};
