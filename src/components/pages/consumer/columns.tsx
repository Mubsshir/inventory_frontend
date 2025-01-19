"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};


export type Customer = {
  cnsr_id: number;
  name: string;
  email: string;
  mobile: string;
  address:string
};


export const columns: ColumnDef<Payment | Customer| any>[] = [
  {
    id: "cnsr_id",
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
  //   accessorKey: "",
  //   header: "Status",
  // },
  {
    accessorKey: "name",
    header: "Consumer Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "mobile",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
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
  //   {
  //     accessorKey: "action",

  //     cell: ({ row }) => {
  //       const payment = row.original;

  //       return (
  //         <DropdownMenu>
  //           <DropdownMenuTrigger asChild>
  //             <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
  //               <span className="sr-only">Open menu</span>
  //               <MoreHorizontal className="h-4 w-4" />
  //             </Button>
  //           </DropdownMenuTrigger>
  //           <DropdownMenuContent
  //             align="center"
  //             className="space-y-2 border px-1 py-2 rounded-sm bg-gray-200"
  //           >
  //             <DropdownMenuItem
  //               className={"hover:bg-red-500 hover:text-white cursor-pointer"}
  //               onClick={() => navigator.clipboard.writeText(payment.id)}
  //             >
  //               Copy Payment ID
  //             </DropdownMenuItem>
  //             <DropdownMenuSeparator />
  //             <DropdownMenuItem
  //               className={"hover:bg-red-500 hover:text-white cursor-pointer"}
  //             >
  //               View customer
  //             </DropdownMenuItem>
  //             <DropdownMenuItem
  //               className={"hover:bg-red-500 hover:text-white cursor-pointer"}
  //             >
  //               View payment details
  //             </DropdownMenuItem>
  //           </DropdownMenuContent>
  //         </DropdownMenu>
  //       );
  //     },
  //   },
];
