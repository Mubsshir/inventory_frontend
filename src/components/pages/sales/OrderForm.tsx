"use client";

import { useContext, useState } from "react";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

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

const OrderForm = () => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Customer | undefined>(
    undefined
  );

  const context = useContext(Store);
  if (!context) {
    return <p>Loading...</p>;
  }

  const { customers } = context;

  return (
    <section className="pt-1 px-2">
      <h3 className="text-sm mb-2">
        Customer Name <span className="text-red-500 ">*</span>
      </h3>
      <div className="flex items-center space-x-4 w-full">
        <Popover open={open} onOpenChange={setOpen}>
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
              <CommandInput placeholder="Search Consumer........" />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {customers?.map((cnsr) => (
                    <CommandItem
                      key={cnsr.cnsr_id}
                      value={String(cnsr.cnsr_id)}
                      onSelect={(value) => {
                        console.log(value);
                        setSelectedItem(
                          customers?.find(
                            (data) => String(data.cnsr_id) == value
                          )
                        );
                        setOpen(false);
                      }}
                    >
                      <span>{cnsr.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
              <Button className="bg-red-500">Add New Customer</Button>
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
    </section>
  );
};
export default OrderForm;

// "use client"
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";
// import {
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
// } from "@radix-ui/react-popover";
// import {
//   CommandInput,
//   CommandList,
//   CommandEmpty,
//   CommandGroup,
//   CommandItem,
// } from "cmdk";
// import { Check, ChevronsUpDown, Command } from "lucide-react";
// import { useState } from "react";

// const frameworks = [
//   {
//     value: "next.js",
//     label: "Next.js",
//   },
//   {
//     value: "sveltekit",
//     label: "SvelteKit",
//   },
//   {
//     value: "nuxt.js",
//     label: "Nuxt.js",
//   },
//   {
//     value: "remix",
//     label: "Remix",
//   },
//   {
//     value: "astro",
//     label: "Astro",
//   },
// ];

// const OrderForm = () => {
//   //   const [placeHolder, setPlaceHolder] = useState(undefined);
//   const [open, setOpen] = useState(false);
//   const [value, setValue] = useState("");

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           role="combobox"
//           aria-expanded={open}
//           className="w-[200px] justify-between"
//         >
//           {value
//             ? frameworks.find((framework) => framework.value === value)?.label
//             : "Select framework..."}
//           <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-[200px] p-0">
//         <Command>
//           <CommandInput placeholder="Search framework..." />
//           <CommandList>
//             <CommandEmpty>No framework found.</CommandEmpty>
//             <CommandGroup>
//               {frameworks.map((framework) => (
//                 <CommandItem
//                   key={framework.value}
//                   value={framework.value}
//                   onSelect={(currentValue) => {
//                     setValue(currentValue === value ? "" : currentValue);
//                     setOpen(false);
//                   }}
//                 >
//                   <Check
//                     className={cn(
//                       "mr-2 h-4 w-4",
//                       value === framework.value ? "opacity-100" : "opacity-0"
//                     )}
//                   />
//                   {framework.label}
//                 </CommandItem>
//               ))}
//             </CommandGroup>
//           </CommandList>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   );
//   {
//     /* <div
//         onClick={() => {
//           setOpen((prev) => !prev);
//         }}
//         className={`${
//           open ? "border-2 shadow-red-400 shadow-lg" : "border-2 border-gray"
//         } rounded-lg text-gray-400 bg-white py-2 px-1  cursor-pointer select-none flex justify-between outline-black`}
//       >
//         {placeHolder || "Select or add a consumer"}
//         {!open ? (
//           <ArrowDownCircle className="text-red-400" />
//         ) : (
//           <ArrowUpCircle className="text-red-400" />
//         )}
//       </div>
//       <div className="w-full h-[320px] bg-red-500 mt-3"></div> */
//   }
// };

// export default OrderForm;
