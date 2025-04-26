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

type Response = {
  status: string;
  message?: string;
  data?: Object;
};

type LoginPayload = {
  user: string;
  pass: string;
};

export const postSignInRequest = async (
  username: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const payload: LoginPayload = { user: username, pass: password }; // keyname cannot be changed as server expects key name like this only
    const res = await fetch(`${BACK_API}/login`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    console.log(data);
    if (res.ok) {
      if (data.status && data.status === "success") {
        Cookies.set("token", data.token || "", { expires: 1 / 24 });
      }
      return {
        status: data.status,
        message: data.message,
        userData: data.user,
      };
    } else {
      return { status: "401", message: "Invalid Username or Password." };
    }
  } catch (err) {
    return { status: "401", message: "Somthing went wrong" };
  }
};

export const authenticateUser = async (
  username: string,
  password: string
): Promise<AuthResponse> => {
  try {
    console.log(getHeaders());
    if (!getHeaders()) {
      return { status: "401", message: "Unauthorized, Please login again." };
    }
    const payload: LoginPayload = { user: username, pass: password }; // keyname cannot be changed as server expects key name like this only
    const res = await fetch(`${BACK_API}/login`, {
      method: "POST",
      headers: { ...getHeaders(), "Content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) {
      return {
        status: data.status,
        message: data.message,
        userData: data.user,
      };
    } else {
      return { status: "401", message: "Unauthorized, Please login again." };
    }
  } catch (err) {
    return { status: "401", message: "Somthing went wrong" };
  }
};

export const checkUserNameAvalability = async (
  username: string
): Promise<AuthResponse> => {
  try {
    const payload = { user_name: username }; // keyname cannot be changed as server expects key name like this only
    const res = await fetch(`${BACK_API}/checkUsername`, {
      method: "POST",
      headers: { ...getHeaders(), "Content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return { status: "401", message: "Somthing went wrong" };
  }
};

export const isUserAuthorized = async (): Promise<AuthResponse> => {
  try {
    console.log(getHeaders());
    if (!getHeaders()) {
      return { status: "401", message: "Unauthorized, Please login again." };
    }
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

export const getRoles = async (): Promise<Response> => {
  try {
    const res = await fetch(BACK_API + "/roles", {
      method: "GET",
      headers: getHeaders(),
    });
    const data = await res.json();
    if (res.ok) {
      return { status: data.status, data: data.data };
    }
    return { status: "error", data: undefined, message: "Somthing went wrong" };
  } catch (err) {
    return { status: "error", data: undefined, message: err as string };
  }
};

export const getMenus = async (): Promise<Response> => {
  try {
    const res = await fetch(BACK_API + "/menus", {
      method: "GET",
      headers: getHeaders(),
    });
    const data = await res.json();
    if (res.ok) {
      return { status: data.status, data: data.data };
    }
    return { status: "error", data: undefined, message: "Somthing went wrong" };
  } catch (err) {
    return { status: "error", data: undefined, message: err as string };
  }
};

export const saveNewUser = async (userdata: Object): Promise<Response> => {
  try {
    const res = await fetch(`${BACK_API}/saveUser`, {
      method: "POST",
      headers: { ...getHeaders(), "Content-type": "application/json" },
      body: JSON.stringify(userdata),
    });
    const data = await res.json();
    console.log(data);
    if (res.ok) {
      return { status: data.status, message: data.message };
    }
    return { status: "error", data: undefined, message: "Somthing went wrong" };
  } catch (err) {
    return { status: "error", data: undefined, message: err as string };
  }
};
