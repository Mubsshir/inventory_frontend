const BACK_API: string = import.meta.env.VITE_LOCAL_URL; // URL of backend

import { getHeaders } from "./getHeader";

export type OrderDetail = {
  OrderID: string;
  OrderDate: string;
  CustomerName: string;
  TotalAmount: string;
  AmountPaid: string;
  OrderCompleted: string;
};

type OrderResponse = {
  status: string;
  message?: string | any;
  data?: OrderDetail[] | any;
};

export const getSalesOrder = async (): Promise<OrderResponse> => {
  try {
    const res = await fetch(BACK_API + "/getOrder", {
      method: "GET",
      headers: getHeaders(),
    });
    const data = await res.json();
    if (res.ok) {
      console.log(data);
      return { status: data.status, data: data.data };
    }
    return { status: "error", data: undefined, message: "Somthing went wrong" };
  } catch (err) {
    return { status: "error", data: undefined, message: err };
  }
};

export const saveOrder = async (
  orderData: any
): Promise<OrderResponse | undefined> => {
  try {
    const res = await fetch(BACK_API + "/saveOrder", {
      method: "POST",
      headers: { ...getHeaders(), "Content-type": "application/json" },
      body: JSON.stringify(orderData),
    });

    const data = await res.json();
    if (res.ok) {
      return { status: data.status, data: data.data };
    }
    return { status: "error", data: undefined, message: data.message };
  } catch (err) {
    return { status: "error", data: undefined, message: err };
  }
};
