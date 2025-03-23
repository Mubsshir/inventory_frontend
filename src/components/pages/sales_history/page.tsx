"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getOrderDetails,
  getSalesOrderHistory,
  OrderDetail,
} from "@/services/Sales";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-table";
import SaleDetails from "./sales-dtl";

const SalesHistory = () => {
  const [recentOrder, setRecentOrder] = useState<OrderDetail[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderDetail[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail>({
    OrderID: "",
    OrderDate: "",
    CustomerName: "",
    TotalAmount: "",
    AmountPaid: "",
    OrderCompleted: "",
  });
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState();

  const fetchRecentOrder = useCallback(async () => {
    const res = await getSalesOrderHistory();
    if (res.status === "success") {
      setRecentOrder(res.data);
      setFilteredOrders(res.data);
    }
  }, []);

  const fetchOrderDetails = useCallback(async (orderID: string) => {
    setLoading(true);
    const res = await getOrderDetails(orderID);
    console.log(res);
    if (res?.status == "success") {
      setOrderData(res.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrderDetails(selectedOrder.OrderID);
  }, [selectedOrder]);

  useEffect(() => {
    fetchRecentOrder();
  }, [fetchRecentOrder]);

  useEffect(() => {
    const filtered = recentOrder.filter(
      (order) =>
        order.OrderID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.CustomerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchTerm, recentOrder]);

  const handleRowClick = (order: OrderDetail) => {
    setSelectedOrder(order);
  };

  const columns: ColumnDef<OrderDetail>[] = [
    {
      accessorKey: "OrderID",
      header: "Order ID",
      cell: ({ row }) => (
        <span className="font-semibold">{row.getValue("OrderID")}</span>
      ),
    },
    {
      accessorKey: "CustomerName",
      header: "Customer",
      cell: ({ row }) => <span>{row.getValue("CustomerName")}</span>,
    },
    {
      accessorKey: "OrderDate",
      header: "Date",
      cell: ({ row }) => row.getValue("OrderDate"),
    },
    {
      accessorKey: "TotalAmount",
      header: "Total (₹)",
      cell: ({ row }) =>
        `₹${parseFloat(row.getValue("TotalAmount")).toLocaleString()}`,
    },
    {
      accessorKey: "AmountPaid",
      header: "Paid (₹)",
      cell: ({ row }) =>
        `₹${parseFloat(row.getValue("AmountPaid")).toLocaleString()}`,
    },
    {
      accessorKey: "OrderCompleted",
      header: "Status",
      cell: ({ row }) =>
        row.getValue("OrderCompleted") === "Yes" ? (
          <Badge className="bg-green-500 cursor-pointer text-white flex items-center px-2 py-1 text-center ">
            <CheckCircle size={14} className="mr-1 " /> Completed
          </Badge>
        ) : (
          <Badge className="bg-red-500 text-white flex items-center px-3 py-1 rounded-md">
            <XCircle size={14} className="mr-1" /> Pending
          </Badge>
        ),
    },
  ];

  return (
    <section className="w-full min-h-screen p-6">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-red-500 p-6 mx-auto">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
          Order History
        </h2>

        <Input
          type="text"
          placeholder="Search by Order ID or Customer Name..."
          className="mb-4 w-full max-w-md p-2 border border-gray-300 dark:border-gray-700 rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <DataTable
          columns={columns}
          data={filteredOrders}
          onRowClick={handleRowClick}
        />
      </div>

      {selectedOrder.OrderID !== "" && !loading && (
        <SaleDetails
          orderDtl={selectedOrder}
          orderData={orderData || []}
          onClose={() => {
            setLoading(true);
          }}
        />
      )}
    </section>
  );
};

export default SalesHistory;
