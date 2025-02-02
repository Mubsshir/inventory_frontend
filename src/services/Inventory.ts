const BACK_API: string = import.meta.env.VITE_LOCAL_URL; // URL of backend
import { Brand, BrandCategory } from "@/store/Store";
import { getHeaders } from "./getHeader";
import { Item } from "@/components/pages/inventory/columns";

type InventoryResponse = {
  status: string;
  message?: string | any;
  data?: BrandCategory[] | Brand[] | Item[];
};

type ItemResponse = {
  status: string;
  message?: string | any;
  data?: Item[];
  item_count?: Number;
};

export const getBrandCategory = async (): Promise<InventoryResponse> => {
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

export const getBrands = async (): Promise<InventoryResponse> => {
  try {
    const res = await fetch(BACK_API + "/brands", {
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

export const getPartList = async (
  cat_id: Number | undefined
): Promise<ItemResponse> => {
  try {
    const res = await fetch(BACK_API + "/getParts", {
      method: "POST",
      headers: { ...getHeaders(), "Content-type": "application/json" },
      body: JSON.stringify({ cat_id: cat_id }),
    });
    const data = await res.json();
    if (res.ok) {
      return {
        status: data.status,
        data: data.data[1],
        item_count: data.data[0],
      };
    }
    console.log(data);
    return { status: "error", data: undefined, message: "Somthing went wrong" };
  } catch (err) {
    return { status: "error", data: undefined, message: err };
  }
};

export const updatePart = async (
  item_to_update: object
): Promise<ItemResponse> => {
  try {
    const res = await fetch(BACK_API + "/updateItem", {
      method: "PUT",
      headers: { ...getHeaders(), "Content-type": "application/json" },
      body: JSON.stringify(item_to_update),
    });

    const data = await res.json();
    return data
  } catch (err) {
    return { status: "error", data: undefined, message: err };
  }
};
