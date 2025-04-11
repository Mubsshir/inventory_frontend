const BACK_API: string = import.meta.env.VITE_LOCAL_URL; // URL of backend
import { getHeaders } from "./getHeader";
import { Customer } from "@/store/Store";

type CustomerRes = {
  status: string;
  data?: Customer[];
  message?: string | any;
};

export const getConsumerList = async (): Promise<CustomerRes | undefined> => {
  try {
    const res = await fetch(BACK_API + "/consumer", {
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
    return { status: "error", data: undefined, message: err };
  }
};

export const saveConsumer = async (
  cnsrdata: any
): Promise<CustomerRes | undefined> => {
  try {
    const res = await fetch(BACK_API + "/consumer", {
      method: "POST",
      headers: { ...getHeaders(), "Content-type": "application/json" },
      body: JSON.stringify(cnsrdata),
    });

    const data = await res.json();
    if (res.ok) {
      return { status: data.status, data: data.data };
    }
    return { status: data.status, data: undefined, message: data.message };
  } catch (err) {
    return { status: "error", data: undefined, message: err };
  }
};
