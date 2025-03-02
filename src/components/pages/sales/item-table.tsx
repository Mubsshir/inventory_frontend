import { Button } from "@/components/ui/button";
import TableRow, { ItemState } from "./item-row";
import { PlusSquare } from "lucide-react";
import { useState } from "react";

let UniqueID: string = Date.now().toString();

const ItemTable = () => {
  const [itemRow, setItemRow] = useState([
    <TableRow
      rowid={UniqueID}
      key={UniqueID}
      removeSelf={(rowid, part_id) => {
        removeRow(rowid, part_id);
      }}
      updateRow={(itemState) => {
        onRowItemUpdate(itemState);
      }}
      usedParts={[0]}
    />,
  ]);
  const [cartItems, setCartItems] = useState<ItemState[]>([]);
  const [usedPartID, setUsedPartID] = useState<number[]>([]);
  const [paymentType, setPaymentType] = useState("Cash");
  const [amountPaid, setAmountPaid] = useState(0);

  const removeRow = (rowid: string, part_id: any) => {
    setItemRow((prev) => prev.filter((row) => row.key !== rowid));
    setCartItems((prev) => prev.filter((item) => item.part_id !== part_id));
  };

  const calculateTotals = (cartItems: ItemState[]) => {
    let totalAmount = 0;
    let totalDiscount = 0;

    cartItems.forEach((item) => {
      const itemTotal = item.price * item.qty; // price * qty
      totalAmount += itemTotal;
      totalDiscount += itemTotal * (item.discount / 100);
    });

    const subTotal = totalAmount; // Same as totalAmount
    const finalTotal = subTotal - totalDiscount; // SubTotal - Discount

    return { totalAmount, totalDiscount, subTotal, finalTotal };
  };

  if (!calculateTotals) {
    return <p>Loading...</p>;
  }
  const { totalAmount, totalDiscount, subTotal, finalTotal } =
    calculateTotals(cartItems);

  const onRowItemUpdate = (itemState: ItemState) => {
    setCartItems((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.part_id === itemState.part_id
      );
      console.log(existingIndex);
      if (existingIndex !== -1) {
        // If item exists, update it
        console.log("Updating Cart");
        return prevCart.map((item, index) =>
          index === existingIndex
            ? {
                ...item,
                qty: itemState.qty,
                discount: itemState.discount,
                total: itemState.total,
              }
            : item
        );
      } else {
        // If item doesn't exist, add it
        console.log("Adding Item into the cart");
        setUsedPartID((prev) => [...prev, itemState.part_id]);
        prevCart.push(itemState);

        return prevCart;
      }
    });
  };
  const balanceAmount = Math.max(finalTotal - amountPaid, 0);
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
        {itemRow.map((row) => row)}
      </div>
      <Button
        onClick={() => {
          setItemRow((prev) => {
            UniqueID = Date.now().toString();
            return [
              ...prev,
              <TableRow
                key={UniqueID}
                rowid={UniqueID}
                removeSelf={(rowid, part_id) => {
                  removeRow(rowid, part_id);
                }}
                updateRow={(itemState) => {
                  onRowItemUpdate(itemState);
                }}
                usedParts={usedPartID}
              />,
            ];
          });
        }}
        className="my-3"
      >
        Add New Row
        <PlusSquare />
      </Button>
      <section className="bg-white  ml-auto p-2 mb-6 flex justify-start">
        <div className="overflow-x-auto mr-5">
          <table className="w-full border-collapse border border-red-500 text-sm text-center">
            <thead>
              <tr className="bg-red-500 text-white">
                <th className="border border-red-500 px-4 py-2">Description</th>
                <th className="border border-red-500 px-4 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-red-500 px-4 py-2 font-semibold">
                  Total Amount
                </td>
                <td className="border border-red-500 px-4 py-2">
                  ₹{totalAmount.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="border border-red-500 px-4 py-2 font-semibold">
                  Total Discount
                </td>
                <td className="border border-red-500 px-4 py-2">
                  ₹{totalDiscount.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="border border-red-500 px-4 py-2 font-semibold">
                  Subtotal
                </td>
                <td className="border border-red-500 px-4 py-2">
                  ₹{subTotal.toFixed(2)}
                </td>
              </tr>
              <tr className="bg-red-100">
                <td className="border border-red-500 px-4 py-2 font-bold">
                  Final Total
                </td>
                <td className="border border-red-500 px-4 py-2 font-bold">
                  ₹{finalTotal.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Payment Section */}
        <div className=" rounded-lg px-4 w-full max-w-md  ">
          <h2 className="text-lg font-bold text-red-500 mb-4">
            Payment Details
          </h2>

          {/* Payment Type Dropdown */}
          <div className="mb-3">
            <label className="block text-red-500 font-semibold mb-1">
              Type of Payment:
            </label>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="w-full border border-red-500 rounded-lg px-3 py-2 focus:outline-none"
            >
              <option value="Cash">Cash</option>
              <option value="Credit">Credit</option>
              <option value="UPI">UPI</option>
            </select>
          </div>

          {/* Amount Paid Input */}
          <div className="mb-3">
            <label className="block text-red-500 font-semibold mb-1">
              Amount Paid:
            </label>
            <input
              type="number"
              value={amountPaid}
              onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
              className="w-full border border-red-400 rounded-lg px-3 py-2 focus:outline-none"
              placeholder="Enter amount"
            />
          </div>

          {/* Balance Amount */}
          <div className="bg-red-100 p-3 rounded-lg">
            <span className="text-red-700 font-bold">Balance Amount:</span>
            <span className="ml-2 font-semibold text-red-600">
              ₹ {balanceAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </section>
      <div className="flex gap-4">
        <button
          onClick={() => {}}
          className="w-1/2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Cancel Order
        </button>
        <button
          onClick={() => {}}
          className="w-1/2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Complete Order
        </button>
      </div>
    </section>
  );
};

export default ItemTable;
