import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { Store } from "@/store/Store";
import { useContext } from "react";
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
  apporveUploadedData,
  FileList,
  getUploadList,
  viewUploadedDataDtl,
  viewUploadedDataForApproval,
} from "@/services/Data";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { useCallback, useEffect, useState } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, Clock8, EyeIcon, XCircle } from "lucide-react";
import { DataTable } from "./data-table";
import { Badge } from "@/components/ui/badge";
import UploadDetails from "./upload-dtl";

const ApproveData = () => {
  const [loading, setIsLoading] = useState(false);
  const [showDataTable, setShowDataTable] = useState(false);
  const [previousUploads, setPreviousUploads] = useState([]);
  const [showConfirmCard, setShowConfirmCard] = useState(false);
  const [selectedUploadID, setSelectedUploadID] = useState("0");
  const [showMessge, setShowMessage] = useState<{
    title: string;
    message: string;
  }>({ title: "", message: "" });
  const [showDialog, setShowDialog] = useState(false);

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

  const context = useContext(Store);

  if (!context) {
    return <p>Loading....</p>;
  }

  const { fetchParts } = context;

  const fetchFileList = useCallback(async () => {
    const res = await getUploadList();
    if (res.status == "success") {
      setFileList(res.data || []);
    }
  }, []);

  useEffect(() => {
    fetchFileList();
  }, []);

  const showConfirmation = (uploadID: string) => {
    setShowConfirmCard(true);
    setSelectedUploadID(uploadID);
  };

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
            <Badge
              onClick={() => {
                showConfirmation(row.getValue("UploadID"));
              }}
              className="bg-orange-500  cursor-pointer text-white flex items-center px-2 py-1 text-center "
            >
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

  const viewHandler = async (refresh?: any) => {
    try {
      setShowDataTable(false);
      if (selectedFileInfo.code == "0") {
        setShowDialog(true);
        setShowMessage({ title: "Error", message: "Please Select File First" });
      }
      const result = await viewUploadedDataForApproval(selectedFileInfo.code);
      if (result.status == "success") {
        if (result.data.length == 0 && !refresh) {
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

  const handleRowClick = (uploadDetails: any) => {
    setSelectedRecord(uploadDetails.UploadID || -1);
  };

  const [selectedRecord, setSelectedRecord] = useState<string>("");
  const [uploadedData, setUploadedData] = useState<[]>();
  
  const approvalHandler = async () => {
    try {
      setShowConfirmCard(false);
      const result = await apporveUploadedData(
        selectedFileInfo.code,
        selectedUploadID
      );
      setShowDialog(true);
      console.log(result);
      if (result.status == "success") {
        setShowMessage({ title: "Success", message: result.data.message });
        fetchParts();
      } else {
        setShowMessage({ title: "Fail", message: result.data.message });
      }
      await viewHandler("yes");
    } catch (err) {
      setShowDialog(true);
      setShowMessage({ title: "Fail", message: "Somthing Went Wrong" });
    }
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
            onClick={async () => {
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

      <Dialog
        open={showConfirmCard}
        onOpenChange={() => {
          setShowConfirmCard(!showConfirmCard);
        }}
      >
        <DialogContent className="top-72 h-fit">
          <DialogHeader>
            <DialogTitle className={"text-orange-500 font-bold"}>
              Warning
            </DialogTitle>
          </DialogHeader>
          <h3 className="font-serif">Are you sure you want to approve this.</h3>
          <div>
            <Button
              onClick={() => {
                setShowConfirmCard(false);
                approvalHandler();
              }}
              className="bg-orange-500 mr-3"
            >
              Yes
            </Button>
            <Button
              onClick={() => {
                setShowConfirmCard(false);
              }}
              className="bg-red-500"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <h3 className="text-lg">
        <span className="font-bold text-red-500">Approve </span> Data
      </h3>
      <div className="w-full flex flex-col items-center justify-center">
        <div className="flex items-center mb-2 ">
          <h3 className="text-sm mr-2">Select Data For Approval</h3>
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
              <SelectValue placeholder="Select File to Approve" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select File to Approve</SelectLabel>
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
          <Button className="bg-blue-500" onClick={viewHandler}>
            <EyeIcon /> View
          </Button>
        </div>
      </div>
      <div>
        {showDataTable && previousUploads.length > 0 && (
          <DataTable columns={columns} data={previousUploads} onRowClick={handleRowClick}/>
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

export default ApproveData;
