const BACK_API: string = import.meta.env.VITE_LOCAL_URL; // URL of backend
import { DashboardData } from "@/components/pages/Dashboard";
import { getHeaders } from "./getHeader";

type Response = {
  status: string;
  message?: string | any;
  data?: Array<DashboardData[]> | any;
};

export const getDashboardData = async (): Promise<Response> => {
  try {
    const res = await fetch(BACK_API + "/getDashboardRecord", {
      method: "GET",
      headers: getHeaders(),
    });
    const data = await res.json();

    if (res.ok) {
      return { status: data.status, data: data.data };
    }
    return {
      status: data.status,
      data: undefined,
      message: "Somthing went wrong",
    };
  } catch (err) {
    console.log(err);
    return { status: "error", data: undefined, message: err };
  }
};
