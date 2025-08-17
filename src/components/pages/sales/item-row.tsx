import { ArrowUpCircle, ArrowDownCircle, MinusCircle } from "lucide-react";
import { FC, useCallback, useEffect, useReducer, useState } from "react";
import { Item } from "../inventory/columns";
import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getPartBySearch } from "@/services/Inventory";
import { SearchList } from "@/components/ui/search-list";

// An enum with all the types of actions to use in our reducer
enum ItemActionKind {
  CHANGE_QTY = "CHANGE_QTY",
  CHANGE_DISCOUNT = "CHANGE_DISCOUNT",
  CHANGE_PARTID = "CHANGE_PARTID",
  CHANGE_RATE = "CHANGE_RATE",
}

// An interface for our actions
interface ItemAction {
  type: ItemActionKind;
  payload: number;
}
// An interface for our state
export interface ItemState {
  part_id: number;
  qty: number;
  price: number;
  discount: number;
  total?: number;
}
const calculateTotal = (qty: number, price: number, discount: number) => {
  return (price - price * (discount / 100)) * qty;
};

function reducer(state: ItemState, action: ItemAction) {
  const { type, payload } = action;
  switch (type) {
    case ItemActionKind.CHANGE_QTY:
      return {
        ...state,
        qty: payload,
        total: calculateTotal(payload, state.price, state.discount),
      };
    case ItemActionKind.CHANGE_DISCOUNT:
      return {
        ...state,
        discount: payload,
        total: calculateTotal(state.qty, state.price, payload),
      };
    case ItemActionKind.CHANGE_RATE:
      return {
        ...state,
        price: payload,
        total: calculateTotal(state.qty, payload, state.discount),
      };
    case ItemActionKind.CHANGE_PARTID:
      return {
        ...state,
        part_id: payload,
        total: calculateTotal(state.part_id, state.price, state.discount),
      };
    default:
      return state;
  }
  throw Error("Unknown action.");
}
const intialState: ItemState = {
  part_id: 0,
  qty: 0,
  price: 0,
  discount: 0,
  total: 0,
};

const TableRow: FC<{
  removeSelf: (key: string,part_id:any) => void;
  rowid: string;
  updateRow: (itemState: ItemState) => void;
  usedParts: number[];
}> = ({ removeSelf, rowid, updateRow, usedParts }) => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | undefined>(undefined);
  const [itemList, setItemList] = useState<Item[] | undefined>();
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [itemState, dispatch] = useReducer(reducer, intialState);

  const fetchItemList = useCallback(async (keyword: string) => {
    try {
      setLoading(true);
      setItemList((prevList) => {
        const result = prevList?.filter(
          (itm) =>
            itm.item_name.toLowerCase().includes(keyword.toLowerCase()) ||
            itm.item_no.toLowerCase().includes(keyword.toLowerCase())
        );
        if (result && result.length > 0) {
          setLoading(false);
          return result;
        }
        console.log("Result Came Empty, Proceeding with Backend API Call...");

        return prevList; // Keep old state while fetching
      });

      const res = await getPartBySearch(keyword.length == 0 ? "" : keyword);
      if (res.status === "success") {
        setItemList(res.data);
      } else {
        setItemList([]);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching items:", err);
      setLoading(false);
    }
  }, []); // ✅ No dependencies required

  useEffect(() => {
    const fetchItems = setTimeout(() => {
      fetchItemList(keyword);
    }, 1000);
    return () => clearTimeout(fetchItems);
  }, [keyword]);

  useEffect(() => {
    if (itemState.part_id !== 0) {
      updateRow(itemState);
    }
  }, [itemState]);

  return (
    <>
      <div className="col-span-2 border border-t-0 ml-[-2px]">
        <Popover
          open={open}
          onOpenChange={() => {
            setOpen(!open);
          }}
        >
          <PopoverTrigger asChild>
            <Button
              className={`w-full h-10 ${
                selectedItem && "bg-red-500"
              } text-sm font-serif flex justify-between`}
            >
              {selectedItem ? (
                <>{selectedItem.item_name.substring(0, 25)}</>
              ) : (
                <>Select Item</>
              )}
              {open ? <ArrowUpCircle /> : <ArrowDownCircle />}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" side="bottom" align="start">
            <SearchList
              key={rowid}
              listItems={
                itemList?.filter(
                  (item) => !usedParts.includes(item.part_id)
                ) as []
              }
              loading={loading}
              onSelect={(value) => {
                setSelectedItem(value as Item);
                dispatch({
                  type: ItemActionKind.CHANGE_PARTID,
                  payload: (value as Item).part_id,
                });
                dispatch({
                  type: ItemActionKind.CHANGE_RATE,
                  payload: parseFloat((value as Item).item_price),
                });
                setOpen(false);
              }}
              onValueChange={(value) => {
                setKeyword(value);
              }}
            />
          </PopoverContent>
        </Popover>
        {selectedItem && (
          <h3 className="font-bold text-sm text-red-500 text-right">
            Qty Left: {selectedItem.item_in_stock}
          </h3>
        )}
      </div>
      <div className="border border-t-0  -ml-[1px]  ">
        <input
          value={itemState.qty}
          onChange={(e) => {
            dispatch({
              type: ItemActionKind.CHANGE_QTY,
              payload: parseInt(e.target.value),
            });
          }}
          type="number"
          className="w-full text-right border focus:border-red-300 rounded-lg outline-none p-2"
          min={0}
          max={selectedItem?.item_in_stock }
          disabled={false}
        />
        <h2 className="text-right pr-3 w-full">PCs</h2>
      </div>
      <div className="border border-t-0  -ml-[1px]  ">
        <input
          type="text"
          className="w-full text-right  rounded-lg outline-none p-2"
          disabled={true}
          value={selectedItem?.item_price || "0.00"}
        />
        <h2 className="text-right pr-3 w-full">Rupees</h2>
      </div>
      <div className="border border-t-0  -ml-[1px]  ">
        <div className="flex align-middle border ">
          <input
            type="number"
            className="w-full text-right  rounded-lg outline-none p-2 "
            step="0.1"
            min={0}
            max={10}
            value={itemState.discount}
            onChange={(e) => {
              dispatch({
                type: ItemActionKind.CHANGE_DISCOUNT,
                payload: parseFloat(e.target.value),
              });
            }}
          />
          <h3 className="my-auto border p-2 text-white bg-red-500">%</h3>
        </div>
      </div>
      <div className="border border-t-0 -ml-[1px] -mr-[2px] relative flex align-middle">
        <h3 className="w-full text-right pr-5 my-auto ">
          {(
            (itemState.price - itemState.price * itemState.discount * 0.01) *
            itemState.qty
          ).toFixed(2)}
        </h3>

        <div
          onClick={() => {
            removeSelf(rowid,itemState.part_id);
          }}
          className=" text-red-500 flex align-middle justify-center cursor-pointer font-bold text-xl  "
        >
          <MinusCircle />
        </div>
      </div>
    </>
  );
};

export default TableRow;
