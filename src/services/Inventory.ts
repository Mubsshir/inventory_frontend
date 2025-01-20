const BACK_API: string = import.meta.env.VITE_LOCAL_URL; // URL of backend
import { BrandCategory } from "@/store/Store";
import { getHeaders } from "./getHeader";

type AuthResponse = {
    status: string;
    message?: string|any;
    data?: BrandCategory[];
  };



export const getBrandCategory = async ():Promise<AuthResponse> => {
  try {
    const res = await fetch(BACK_API + "/brandcategory", {
      method: "GET",
      headers: getHeaders(),
    });
    const data = await res.json();
    if (res.ok) {
      return { status: data.status, data: data.data };
    }
    return { status: "error", data: undefined, message: "Somthing went wrong" };
  } catch (err) {
    return { status: "error", data: undefined, message: err };
  }
};


