import { X } from "lucide-react";
import React from "react";

export type UploadDetail = {
  UploadID: string;
  UploadTime: string;
  ErrorCode: string;
  SerialNo: string;
  Value1: string;
  Value2?: string;
  Value3?: string;
  Value4?: string;
  Value5?: string;
  Value6?: string;
  Value7?: string;
  Value8?: string;
  Value9?: string;
  Value10?: string;
  Value11?: string;
  Value12?: string;
  Value13?: string;
  Value14?: string;
  Value15?: string;
  Value16?: string;
};

const UploadDetails: React.FC<{
  updloadData: UploadDetail[] | [];
  onClose: () => void;
}> = ({ updloadData, onClose }) => {
  if (!updloadData) return null;

  const columnname = Object.keys(updloadData[0]);
  console.log(columnname);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 shadow-xl rounded-lg p-6 transform translate-y-0 transition-transform animate-slideDown">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-2xl font-bold text-red-600">Uploaded Data</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white">
              <tr>
                {columnname.map((name, idx) => (
                  <TableHeader key={idx}>{name}</TableHeader>
                ))}
              </tr>
            </thead>
            <tbody>
              {updloadData.map((item: any, index: number) => (
                <tr key={index} className="border-b dark:border-gray-700">
                  {columnname.map((name, idx) => (
                    <TableCell key={name}>{item[columnname[idx]]}</TableCell>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Print & Close Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Reusable Components

const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th className="p-3 text-left font-semibold border border-gray-300 dark:border-gray-700">
    {children}
  </th>
);

const TableCell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <td className="p-3 border border-gray-300 dark:border-gray-700">
    {children}
  </td>
);

export default UploadDetails;
