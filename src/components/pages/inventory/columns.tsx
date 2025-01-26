"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type Item = {
  part_id: number;
  cat_id: number;
  item_name: string;
  item_no: string;
  item_price: string;
  item_in_stock: number;
  brand_name: string;
};

export const columns: ColumnDef<Item | any>[] = [
  {
    id: "part_id",
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
  // {
  //   accessorKey: "amount",
  //   header: () => <div className="text-center">Amount</div>,
  //   cell: ({ row }) => {
  //     const amount = parseFloat(row.getValue("amount"));
  //     const formatted = new Intl.NumberFormat("en-US", {
  //       style: "currency",
  //       currency: "INR",
  //     }).format(amount);

  //     return <div className="text-center font-medium">{formatted}</div>;
  //   },
  // },
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
    cell: ({ row }) => {
      console.log(row.getCanExpand())
      return (
        <Popover>
          <PopoverTrigger>...</PopoverTrigger>
          <PopoverContent className="-translate-x-10 w-44">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Edit Item</CardTitle>
              </CardHeader>
              <CardContent>
                Place Holder
              </CardContent>
            </Card>
          </PopoverContent>
        </Popover>
      );
    },
  },
];
