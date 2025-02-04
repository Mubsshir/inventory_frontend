"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import UpdateItem from "./update-item";
import { useState } from "react";

export type Item = {
  part_id: number;
  cat_id: number;
  item_name: string;
  item_no: string;
  item_price: string;
  item_in_stock: number;
  brand_name: string;
};
//accessor Key is important to get value in row.getValue(accessorKey)
export const columns: ColumnDef<Item | any>[] = [
  {
    id: "part_id",
    accessorKey: "part_id",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   accessorKey: "cat_id",
  //   enableHiding: true,
  // },
  {
    accessorKey: "item_name",
    header: "Item Name",
  },
  {
    accessorKey: "item_no",
    header: "Item Code",
  },
  {
    accessorKey: "item_price",
    header: "Price",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("item_price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "item_in_stock",
    header: () => <div className="text-center">Available Quantity</div>,
    cell: ({ row }) => {
      const qty = parseInt(row.getValue("item_in_stock"));
      return <div className="font-bold text-center">{qty}</div>;
    },
  },
  {
    accessorKey: "brand_name",
    header: "Brand",
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const price = parseFloat(row.getValue("item_price"));
      const qty = parseInt(row.getValue("item_in_stock"));
      const part_id = parseInt(row.getValue("part_id"));
      const [openUpdate, setOpenUpdate] = useState(false);
      const updateTable=table.options.meta?.updateRowData;
      const closePop = () => {
        setOpenUpdate(false);
        
      };
      return (
        <Popover open={openUpdate} onOpenChange={setOpenUpdate}>
          <PopoverTrigger>...</PopoverTrigger>
          <PopoverContent className="-translate-x-10 z-40">
            <UpdateItem
              closeDialog={() => {
                closePop();
              }}
              price={price}
              qty={qty}
              part_id={part_id}
              updateTable={updateTable}
            />
          </PopoverContent>
        </Popover>
      );
    },
  },
];
