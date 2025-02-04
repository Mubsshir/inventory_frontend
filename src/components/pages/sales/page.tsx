import { Button } from "@/components/ui/button";
import { ArrowBigUp, PlusIcon } from "lucide-react";
import { useState } from "react";
import "@/App.css";
import OrderForm from "./OrderForm";

const Sale = () => {
  const [viewOrderForm, setViewOrderForm] = useState(false);
  return (
    <section className="w-full h-full relative">
      <div className="flex items-center justify-between">
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
          className="text-center cursor-pointer w-full  mx-auto bg-red-500 shadow-sm absolute bottom-0"
          onClick={() => {
            setViewOrderForm(false);
          }}
        >
          <ArrowBigUp className="mx-auto text-white " />
        </div>
        <OrderForm/>
      </div>
    </section>
  );
};

export default Sale;
