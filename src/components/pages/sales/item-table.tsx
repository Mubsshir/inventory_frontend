import { Button } from "@/components/ui/button";
import TableRow from "./item-row";
import { PlusSquare } from "lucide-react";

const ItemTable = () => {


  return (
    <section className="w-full  py-3">
      <div className="w-full mb-2 ">
        <h3 className="font-bold text-red-500">Item table</h3>
      </div>
      <div className="grid grid-cols-6 [&>h3]:px-2 [&>h3]:py-2 [&>h3]:border-gray-500 [&>h3]:font-bold  ">
        <h3 className="col-span-2  ml-[-2px]">Item Name</h3>
        <h3 className=" -ml-[1px]">Quantity</h3>
        <h3 className=" -ml-[1px]">Rate</h3>
        <h3 className=" -ml-[1px]">Discount</h3>
        <h3 className=" -ml-[1px] -mr-[2px]">Amount</h3>
      </div>
      <div className="grid grid-cols-6 [&>div]:px-2 [&>div]:py-2 [&>div]:border-gray-300  border-b">
        <TableRow />
      </div>
      <Button className="mt-1">Add New Row<PlusSquare/></Button>
    </section>
  );
};

export default ItemTable;
