/**
 * ------------------------------------------------------------------------------
 * File: search-list.tsx
 * Author: Mubasshir Khan
 * Date: 16-Feb-2025
 * ------------------------------------------------------------------------------
 * Custom React Component to provide Search
 * Functionality In Object of Array
 * ------------------------------------------------------------------------------
 **/
import { FC } from "react";
import { Input } from "./input";
import { Loader2 } from "lucide-react";

const SearchList: FC<{
  listItems: [] | undefined;
  placeholderText?: string | undefined;
  onSelect: (value: {}) => void;
  onValueChange: (value: string) => void;
  loading: boolean;
}> = ({ listItems, placeholderText, onSelect, onValueChange, loading }) => {
  return (
    <div className="p-1">
      <Input
        placeholder={placeholderText || "Enter text for search...."}
        onChange={(e) => {
          onValueChange(e.target.value);
        }}
        className="outline-none border-none mb-1 "
      />
      <div className="">
        <ul className="px-0 py-2 m-0 h-fit max-h-52 overflow-y-scroll  p-1">
          {loading ? (
            <p className="text-center py-2 font-bold flex align-middle justify-center">
              <Loader2 />
              Loading......
            </p>
          ) : listItems && listItems.length == 0 ? (
            <h3 className="text-center">No Records Found</h3>
          ) : (
            listItems?.map((item: any) => {
              return (
                <li
                  onClick={() => {
                    onSelect(item);
                  }}
                  className="pl-3 py-1 hover:bg-red-500 hover:text-white text-sm cursor-pointer"
                >
                  {item.item_name}
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
};

export { SearchList };
