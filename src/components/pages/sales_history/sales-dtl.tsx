import React from "react";
import { X } from "lucide-react";
import { OrderDetail } from "@/services/Sales";

const SaleDetails: React.FC<{
  orderDtl: OrderDetail;
  orderData: [];
  onClose: () => void;
}> = ({ orderDtl, orderData, onClose }) => {
  if (!orderDtl || !orderData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 p-4">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-900 shadow-xl rounded-lg p-6 transform translate-y-0 transition-transform animate-slideDown">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-2xl font-bold text-red-600">Invoice</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Order Details */}
        <div className="mb-6 space-y-2">
          <DetailRow label="Order ID" value={orderDtl.OrderID} />
          <DetailRow label="Customer Name" value={orderDtl.CustomerName} />
          <DetailRow label="Order Date" value={orderDtl.OrderDate} />
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white">
              <tr>
                <TableHeader>Item</TableHeader>
                <TableHeader>Brand</TableHeader>
                <TableHeader>Qty</TableHeader>
                <TableHeader>Price (₹)</TableHeader>
                <TableHeader>Discount (%)</TableHeader>
                <TableHeader>Final Amount (₹)</TableHeader>
              </tr>
            </thead>
            <tbody>
              {orderData.map((item:any, index:number) => (
                <tr key={index} className="border-b dark:border-gray-700">
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.Brand}</TableCell>
                  <TableCell>{item.Qty}</TableCell>
                  <TableCell>{item.Price}</TableCell>
                  <TableCell>{item.Discount.toFixed(1)}</TableCell>
                  <TableCell>{item.FinalAmount}</TableCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Section */}
        <div className="mt-6 space-y-2 border-t pt-4">
          <DetailRow
            label="Total Amount"
            value={`₹${orderDtl.TotalAmount}`}
          />
          <DetailRow
            label="Amount Paid"
            value={`₹${orderDtl.AmountPaid}`}
          />
          <DetailRow
            label="Order Status"
            value={
              orderDtl.OrderCompleted === "Yes" ? "✅ Completed" : "❌ Pending"
            }
            isBold
          />
        </div>

        {/* Print & Close Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Print Invoice
          </button>
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
const DetailRow: React.FC<{
  label: string;
  value: string | number;
  isBold?: boolean;
}> = ({ label, value, isBold = false }) => (
  <div className="flex justify-between text-gray-800 dark:text-gray-200">
    <span className="font-medium">{label}:</span>
    <span className={isBold ? "font-bold text-lg" : ""}>{value}</span>
  </div>
);

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

export default SaleDetails;
