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
} from "@/services/Data";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { useCallback, useEffect, useState } from "react";

const ImportData = () => {
  const [loading, setIsLoading] = useState(false);
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
  useEffect(() => {
    fetchFileList();
  }, []);

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
                  <SelectItem className="text-black" key={idx} value={itm.code}>
                    {itm.name}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
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
            disabled={loading}
          >
            Download Format
          </Button>
        </div>
        <div className="flex items-center space-x-2 justify-center w-full mt-3">
          <Button
            className="bg-green-500"
            onClick={handleFileUpload}
            disabled={uploading}
          >
            Upload
          </Button>
          <Button className="bg-red-500">View</Button>
        </div>
      </div>
    </section>
  );
};

export default ImportData;
