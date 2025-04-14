import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileList,
  getExcelFormat,
  getUploadList,
  uploadExcelFile,
  viewUploadedData,
  viewUploadedDataDtl,
} from "@/services/Data";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { useCallback, useEffect, useState } from "react";

import { ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle,
  Clock8,
  DownloadIcon,
  EyeIcon,
  UploadIcon,
  XCircle,
} from "lucide-react";
import { DataTable } from "./data-table";
import { Badge } from "@/components/ui/badge";
import UploadDetails from "./upload-dtl";

const ImportData = () => {
  const [loading, setIsLoading] = useState(false);
  const [showDataTable, setShowDataTable] = useState(false);
  const [previousUploads, setPreviousUploads] = useState([]);
  const [showMessge, setShowMessage] = useState<{
    title: string;
    message: string;
  }>({ title: "", message: "" });
  const [showDialog, setShowDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<FileList[]>([
    {
      code: "0",
      name: "No Data",
    },
  ]);
  const [selectedFileInfo, setSelectedFileInfo] = useState<FileList>({
    code: "0",
    name: "nofileselected",
  });
  const [selectedRecord, setSelectedRecord] = useState<string>("");
  const [uploadedData, setUploadedData] = useState<[]>();
  const fetchFileList = useCallback(async () => {
    const res = await getUploadList();
    if (res.status == "success") {
      setFileList(res.data || []);
    }
  }, []);

  const downloadFileHandler = async () => {
    try {
      setIsLoading(true);

      if (!selectedFileInfo || selectedFileInfo.code == "0") {
        setIsLoading(false);
        alert("Pleaes Select File Type");

        return;
      }
      const file = await getExcelFormat(
        (selectedFileInfo && selectedFileInfo.code) || "0"
      );
      setIsLoading(false);
      const url = window.URL.createObjectURL(new Blob([file]));
      const link = document.createElement("a");
      link.href = url;
      console.log(selectedFileInfo);
      link.setAttribute(
        "download",
        `${selectedFileInfo && selectedFileInfo.name}.xlsx`
      );

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  // Handle File Selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Handle File Upload to API
  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    setUploading(true);

    try {
      const result = await uploadExcelFile(selectedFile, selectedFileInfo.code);
      if (result) {
        setShowDialog(true);
      }
      if (result.status == "success") {
        setShowMessage({ title: "Success", message: result.message });
      } else {
        setShowMessage({ title: "Error", message: result.message });
      }
      setUploading(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file!");
    } finally {
      setUploading(false);
    }
  };

  const handleRowClick = (uploadDetails: any) => {
    setSelectedRecord(uploadDetails.UploadID || -1);
  };

  const fetchUploadDTL = useCallback(async (uploadID: string) => {
    setIsLoading(true);
    const res = await viewUploadedDataDtl(uploadID);
    console.log(res);
    if (res?.status == "success") {
      setUploadedData(res.data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchUploadDTL(selectedRecord);
  }, [selectedRecord]);

  useEffect(() => {
    fetchFileList();
  }, []);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "UploadID",
      header: "Upload ID",
      cell: ({ row }) => (
        <span className="font-semibold">{row.getValue("UploadID")}</span>
      ),
    },
    {
      accessorKey: "UploadTime",
      header: "Upload Time",
      cell: ({ row }) => <span>{row.getValue("UploadTime")}</span>,
    },
    {
      accessorKey: "FileName",
      header: "File Name",
      cell: ({ row }) => row.getValue("FileName"),
    },
    {
      accessorKey: "TotalCount",
      header: "Total Records",
      cell: ({ row }) => parseInt(row.getValue("TotalCount")).toLocaleString(),
    },
    {
      accessorKey: "ErrorCount",
      header: "Error",
      cell: ({ row }) => parseInt(row.getValue("ErrorCount")).toLocaleString(),
    },
    {
      accessorKey: "Status",
      header: "Approval Status",
      cell: ({ row }) => {
        if (row.getValue("Status") === "Pending") {
          return (
            <Badge className="bg-orange-500  cursor-pointer text-white flex items-center px-2 py-1 text-center ">
              <Clock8 size={14} className="mr-1 " /> Pending
            </Badge>
          );
        } else if (row.getValue("Status") === "Approved") {
          return (
            <Badge className="bg-green-500 cursor-pointer text-white flex items-center px-2 py-1 text-center ">
              <CheckCircle size={14} className="mr-1 " /> Approved
            </Badge>
          );
        } else if (row.getValue("Status") === "Error") {
          return (
            <Badge className="bg-red-500 ">
              <XCircle size={14} className="mr-1 " />
              Error
            </Badge>
          );
        }
      },
    },
  ];

  const viewHandler = async () => {
    try {
      setShowDataTable(false);
      if (selectedFileInfo.code == "0") {
        setShowDialog(true);
        setShowMessage({ title: "Error", message: "Please Select File First" });
      }
      const result = await viewUploadedData(selectedFileInfo.code);
      if (result.status == "success") {
        if (result.data.length == 0) {
          setShowDialog(true);
          setShowMessage({ title: "Info", message: "No Records Found" });
          return;
        }
        setShowDataTable(true);
        setPreviousUploads(result.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className=" space-y-2">
      <Dialog
        open={showDialog}
        onOpenChange={() => {
          setShowDialog(!showDialog);
        }}
      >
        <DialogContent className="top-72 h-fit">
          <DialogHeader>
            <DialogTitle
              className={`${
                showMessge.title !== "Success"
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {showMessge.title}
            </DialogTitle>
          </DialogHeader>
          <h3 className="font-serif">{showMessge.message}</h3>
          <Button
            onClick={() => {
              setShowDialog(false);
            }}
            className={`${
              showMessge.title !== "Success" ? "bg-red-500" : "bg-green-500"
            }`}
          >
            Ok
          </Button>
        </DialogContent>
      </Dialog>

      <h3 className="text-lg">
        <span className="font-bold text-red-500">Import</span> Data
      </h3>
      <div className="w-full flex flex-col items-center justify-center">
        <div className="flex items-center mb-2 ">
          <h3 className="text-sm mr-2">Select Data For Import</h3>
          <Select
            onValueChange={(value) => {
              const fileInfo: FileList[] =
                fileList &&
                fileList.filter((itm) => {
                  return itm.code == value;
                });

              setSelectedFileInfo(fileInfo && fileInfo[0]);
            }}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a File To Upload" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select File For Upload</SelectLabel>
                {fileList &&
                  fileList.map((itm, idx) => (
                    <SelectItem
                      className="text-black"
                      key={idx}
                      value={itm.code}
                    >
                      {itm.name}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2 justify-center w-full mt-3">
          <Input
            className="w-[280px]  "
            id="excel"
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
          />
          <Button
            className="bg-red-500"
            onClick={downloadFileHandler}
           
          >
            Download Format <DownloadIcon />
          </Button>
        </div>
        <div className="flex items-center space-x-2 justify-center w-full mt-3">
          <Button
            className="bg-green-500"
            onClick={handleFileUpload}
            disabled={uploading}
          >
            <UploadIcon />
            Upload
          </Button>
          <Button className="bg-blue-500" onClick={viewHandler}>
            <EyeIcon /> View
          </Button>
        </div>
      </div>
      <div>
        {showDataTable && previousUploads.length > 0 && (
          <DataTable
            columns={columns}
            data={previousUploads}
            onRowClick={handleRowClick}
          />
        )}
      </div>
      {selectedRecord &&
        selectedRecord !== "" &&
        !loading &&
        uploadedData &&
        uploadedData?.length > 0 && (
          <UploadDetails
            updloadData={uploadedData || []}
            onClose={() => {
              setIsLoading(true);
            }}
          />
        )}
    </section>
  );
};

export default ImportData;
