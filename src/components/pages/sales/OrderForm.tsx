"use client";

import { useContext, useEffect, useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Customer, Store } from "@/store/Store";
import AddConsumer from "../consumer/add-consumer";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import ItemTable from "./item-table";
import { ItemState } from "./item-row";
import { saveOrder } from "@/services/Sales";
import { useToast } from "@/hooks/use-toast";

const OrderForm: React.FC<{
  closeOrder: Function;
}> = ({ closeOrder }) => {
  const [open, setOpen] = useState(false);
  const [openAddConsumer, setOpenAddConsumer] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Customer | undefined>(
    undefined
  );
  const [orderDate, setOrderDate] = useState<Date | undefined>(undefined);
  const [consumerList, setConsumerList] = useState<Customer[] | undefined>(
    undefined
  );

  const { toast } = useToast();
  const CompleteOrder = async (cartItems: ItemState[], cartValue: object) => {
    setOpen(false);
    const orderData = {
      cnsr_id: selectedItem?.cnsr_id,
      orderDate: orderDate,
      items: cartItems,
      cartValue,
    };

    const res = await saveOrder(orderData);
    console.log(res);
    if (res?.status == "success") {
      toast({
        title: "Success",
        description: "Order Created Successfully",
      });
    }
    else if  (res?.status == "fail") {
      toast({
        title: "Fail",
        description: res.message||"Somthing went wrong",
      });
    } 
    else {
      toast({
        title: "Error",
        description: "Somthing went wrong",
      });
    }
    closeOrder();
  };

  const context = useContext(Store);
  if (!context) {
    return <p>Loading...</p>;
  }

  const { customers } = context;

  const inputChangeHandler = (e: any) => {
    setConsumerList(() => {
      console.log(e.length);
      return e.length === 0
        ? customers
        : customers?.filter((cnsr) => {
            return cnsr.name.toLowerCase().includes(e.toLowerCase());
          });
    });
    console.log(consumerList);
  };

  useEffect(() => {
    setConsumerList(customers);
  }, []);

  return (
    <section className="pt-1 px-2 relative">
      <h3 className="text-sm mb-2">
        Customer Name <span className="text-red-500 ">*</span>
      </h3>

      <div className="flex items-center space-x-4 w-full">
        <Popover
          open={open}
          onOpenChange={() => {
            setOpen(!open);
            setOpenAddConsumer(!setOpenAddConsumer);
          }}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full h-10 text-md font-thin flex justify-between"
            >
              {selectedItem ? (
                <>{selectedItem.name}</>
              ) : (
                <>Select or add consumer</>
              )}
              {open ? <ArrowUpCircle /> : <ArrowDownCircle />}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" side="bottom" align="start">
            <Command>
              <CommandInput
                placeholder="Search Consumer........"
                onValueChange={inputChangeHandler}
              />
              <CommandList>
                {consumerList?.length == 0 ? (
                  <CommandEmpty>No results found.</CommandEmpty>
                ) : (
                  <CommandGroup>
                    {consumerList?.map((cnsr) => (
                      <CommandItem
                        key={cnsr.cnsr_id}
                        value={String(cnsr.name)}
                        onSelect={() => {
                          setSelectedItem(cnsr);
                          setOpen(false);
                        }}
                      >
                        <span>{cnsr.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
              <Button
                className="bg-red-500"
                onClick={() => {
                  setOpenAddConsumer(true);
                }}
              >
                Add New Customer
              </Button>
              {openAddConsumer && (
                <AddConsumer
                  closeDialog={() => setOpenAddConsumer(false)}
                  className={` absolute z-50 translate-x-2/4 `}
                />
              )}
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      {selectedItem && (
        <div className="my-2 bg-white p-2 w-full shadow-sm rounded-md space-y-2">
          <h3>
            {" "}
            <span className="font-bold">Email :</span> {selectedItem.email}
          </h3>
          <h3>
            {" "}
            <span className="font-bold">Mobile :</span> {selectedItem.mobile}
          </h3>
          <h3>
            {" "}
            <span className="font-bold">Address : </span>
            {selectedItem.address}
          </h3>
        </div>
      )}
      <h3 className="text-sm my-2">Order Date</h3>
      <>
        <Popover>
          <PopoverTrigger asChild>
            <div
              className={
                "select-none cursor-pointer w-[200px] pl-3 text-left font-normal bg-white border flex items-center p-2 rounded-lg"
              }
            >
              {" "}
              {orderDate ? format(orderDate, "PPP") : <span>Pick a date</span>}
              <CalendarIcon
                color="red"
                className="ml-auto h-4 w-4 opacity-50"
              />
            </div>
          </PopoverTrigger>
          <PopoverContent side="bottom" align="start">
            <Calendar
              mode="single"
              selected={orderDate}
              onSelect={setOrderDate}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </>
      <div>
        <ItemTable
          order_date={orderDate}
          cnsr_id={selectedItem?.cnsr_id}
          cancleOrder={closeOrder}
          CompleteOrder={CompleteOrder}
        />
      </div>
    </section>
  );
};
export default OrderForm;
