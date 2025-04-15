import { Button } from "@/components/ui/button";
import { ArrowBigUp, PlusIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import "@/App.css";
import OrderForm from "./OrderForm";
import { getSalesOrder, OrderDetail } from "@/services/Sales";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import { useLocation } from "react-router";
import SalesHistory from "../sales_history/page";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Sale = () => {
  const [viewOrderForm, setViewOrderForm] = useState(false);
  const [IsLoading, setIsLoading] = useState(false);
  const [recentOrder, setRecentOrder] = useState<OrderDetail[] | undefined>(
    undefined
  );

  const fetchRecentOrder = useCallback(async () => {
    setIsLoading(true);
    const res = await getSalesOrder();
    if ((res.status = "success")) {
      console.log(res.data);
      setRecentOrder(res.data);
    }
    setIsLoading(false);
  }, []);

  const { pathname } = useLocation();
  useEffect(() => {
    if (viewOrderForm == false) {
      fetchRecentOrder();
    }
  }, [viewOrderForm]);

  if (pathname == "/sale/add-sale" || pathname == "/sale")
    return (
      <section className="w-full h-full relative">
        <div className="flex items-center justify-between px-5 pt-3">
          <h3 className="text-xl">
            <span className="text-red-500 font-bold">Sales</span> Order
          </h3>
          <Button
            className="bg-red-500 px-4"
            onClick={() => {
              setViewOrderForm(true);
            }}
          >
            <PlusIcon color="white" /> Add Order
          </Button>
        </div>

        <div
          className={` w-full h-full z-20 pullFormDown ${
            viewOrderForm && "pullFormActive "
          } `}
        >
          <div
            className="text-center cursor-pointer w-full  mx-auto bg-red-500 shadow-sm  "
            onClick={() => {
              setViewOrderForm(false);
            }}
          >
            <ArrowBigUp className="mx-auto text-white " />
          </div>
          <div className="w-full h-full overflow-y-scroll">
            <OrderForm
              closeOrder={() => {
                setViewOrderForm(false);
              }}
            />
            <div className="h-24 mb-5 w-full"></div>
          </div>
        </div>
        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-red-500 mt-10 w-5/6 mx-auto ">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">
            Recent Orders
          </h2>
          {IsLoading ? (
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
          ) : recentOrder && recentOrder?.length > 0 ? (
            <div className="space-y-4 max-h-[70vh] overflow-y-scroll">
              {recentOrder?.map((order, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Order #{order.OrderID}
                    </h3>
                    {order.OrderCompleted === "Yes" ? (
                      <Badge className="bg-green-500 text-white flex items-center px-3 py-1 rounded-md">
                        <CheckCircle size={14} className="mr-1" />
                        Completed
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500 text-white flex items-center px-3 py-1 rounded-md">
                        <XCircle size={14} className="mr-1" />
                        Pending
                      </Badge>
                    )}
                  </div>

                  <div className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
                    <p>
                      <span className="font-semibold">Customer:</span>{" "}
                      {order.CustomerName}
                    </p>
                    <p>
                      <span className="font-semibold">Date:</span>{" "}
                      {order.OrderDate.toString()}
                    </p>
                    <p>
                      <span className="font-semibold">Total:</span> ₹
                      {parseFloat(order.TotalAmount).toLocaleString()}
                    </p>
                    <p>
                      <span className="font-semibold">Paid:</span> ₹
                      {parseFloat(order.AmountPaid).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <h3>No Orders Found</h3>
          )}
        </div>
      </section>
    );
  else if (pathname == "/sale/history") return <SalesHistory />;
};

export default Sale;
