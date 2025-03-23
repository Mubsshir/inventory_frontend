import { getHeaders } from "./getHeader";
const BACK_API: string = import.meta.env.VITE_LOCAL_URL;

export type FileList = {
  code: string;
  name: string;
};

type Response = {
  status: string;
  message?: string | any;
  data?: FileList[];
};

export const getUploadList = async (): Promise<Response> => {
  try {
    const res = await fetch(BACK_API + "/getUploadList", {
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

export const viewUploadedData = async (excelId: string): Promise<Response> => {
  try {
    const res = await fetch(BACK_API + "/viewExcelData", {
      method: "POST",
      headers: { ...getHeaders(), "Content-type": "application/json" },
      body: JSON.stringify({ file_id: excelId }),
    });
    const data = await res.json();

    return data;
  } catch (err) {
    return { status: "error", data: undefined, message: err };
  }
};

export const getExcelFormat = async (excelId: string): Promise<BlobPart> => {
  try {
    const res = await fetch(BACK_API + "/getExcel", {
      method: "POST",
      headers: { ...getHeaders(), "Content-type": "application/json" },
      body: JSON.stringify({ file_id: excelId }),
    });
    const data = await res.blob();

    return data;
  } catch (err) {
     throw new Error("Unable to fetch Format file")
  }
};

export const uploadExcelFile = async (
  file: File,
  excelId?: string
): Promise<Response> => {
  try {
    // Create FormData to send the file
    const formData = new FormData();
    formData.append("excel_file", file); // "excelFile" matches server-side multer field name
    if (excelId) {
      formData.append("file_id", excelId); // Optional excelId if needed by server
    }

    const res = await fetch(BACK_API + "/saveExcel", {
      method: "POST",
      headers: { ...getHeaders() }, // No "Content-Type" here; FormData sets it automatically
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Upload failed: ${res.status} - ${errorText}`);
    }
    console.log("Uploading");
    const data = await res.json(); // Assuming server returns JSON response
    console.log(data);

    return data; // Return server response (e.g., success message or data)
  } catch (error) {
    return { status: "fail", message: error };
  }
};
