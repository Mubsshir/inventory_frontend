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
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SalesHistory = () => {
  const [recentOrder, setRecentOrder] = useState<OrderDetail[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderDetail[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openInvoice, setOpenInvoice] = useState(false);
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
    setOpenInvoice(true);
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
        {loading ? (
          <div className="w-full h-full overflow-y-scroll space-y-4 p-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="w-full">
                <CardHeader className="px-4">
                  <Skeleton className="h-6 w-1/3 bg-gray-300" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="space-y-2">
                        <Skeleton className="h-6 w-3/4 bg-gray-200" />
                        <Skeleton className="h-40 w-full rounded-md bg-gray-200" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : orderData ? (
          <>
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
          </>
        ) : (
          <h3>No History Found</h3>
        )}
      </div>

      {selectedOrder.OrderID !== "" && openInvoice && (
        <SaleDetails
          orderDtl={selectedOrder}
          orderData={orderData || []}
          onClose={() => {
            setOpenInvoice(false);
          }}
        />
      )}
    </section>
  );
};

export default SalesHistory;
