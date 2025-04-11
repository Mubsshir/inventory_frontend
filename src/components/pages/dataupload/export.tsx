import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FileList, getExportData, getExportList } from "@/services/Data";

import { useCallback, useEffect, useState } from "react";
import { DownloadIcon } from "lucide-react";
import { useNavigate } from "react-router";

const ExportData = () => {
  const [loading, setIsLoading] = useState(false);

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

  const navigate = useNavigate();
  const fetchFileList = useCallback(async () => {
    const res = await getExportList();
    console.log(res);
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
      const file: any = await getExportData(
        (selectedFileInfo && selectedFileInfo.code) || "0"
      );

      if (file.status == "401") {
        navigate("/login");
        return;
      }
      const url = window.URL.createObjectURL(new Blob([file as BlobPart]));
      const link = document.createElement("a");
      link.href = url;

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

  useEffect(() => {
    fetchFileList();
  }, []);

  return (
    <section className=" space-y-2">
      <h3 className="text-lg">
        <span className="font-bold text-red-500">Import</span> Data
      </h3>
      <div className="w-full flex flex-col items-center justify-center">
        <div className="flex items-center mb-2 ">
          <h3 className="text-sm mr-2">Select Data For Export</h3>
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
              <SelectValue placeholder="Select a File To Export" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select File For Export</SelectLabel>
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
          <Button className="bg-green-500" onClick={downloadFileHandler}>
            <DownloadIcon />
            Export
          </Button>
        </div>
        {loading && (
          <h3 className="text-center font-bold text-red-500 mt-9">
            Fetching Data.....
          </h3>
        )}
      </div>
    </section>
  );
};

export default ExportData;
