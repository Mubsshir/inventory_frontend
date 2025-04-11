import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/ui/Loading";
import { Store } from "@/store/Store";
import { useContext, useEffect, useState } from "react";
const BACK_API: string = import.meta.env.VITE_LOCAL_URL;
import { useLocation } from "react-router";
import { DataTable } from "./data-table";
import { columns, Item } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";

import { Input } from "@/components/ui/input";

const Inventory = () => {
  const { pathname } = useLocation();
  const context = useContext(Store);

  const [catID, setCatID] = useState<number>(-1);
  const [items, setItems] = useState<Item[]>();

  const [filteredStock, setFilteredStock] = useState<Item[]>();
  const [searchTerm, setSearchTerm] = useState("");
  if (!context) {
    return <Loading />;
  }

  const { brandCategories, brands, isLoading, parts, setParts } = context;

  const catChangeHandler = (cat_id: number) => {
    setCatID(cat_id);
    if (cat_id == -1) {
      setItems(parts);
    } else {
      setItems(() => {
        return parts?.filter((part) => part.cat_id == cat_id);
      });
    }
  };
  const onItemUpdate = (part_id: any, newPrice: any, newQty: any) => {
    setItems((prevData) =>
      prevData?.map((item) =>
        item.part_id == part_id
          ? { ...item, item_in_stock: newQty, item_price: newPrice }
          : item
      )
    );
    const updateStoreItem = parts?.map((item) =>
      item.part_id == part_id
        ? { ...item, item_in_stock: newQty, item_price: newPrice }
        : item
    );
    setParts(updateStoreItem as Item[]);
  };

  useEffect(() => {
    const filtered = items?.filter(
      (itm) =>
        itm.item_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        itm.item_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStock(filtered);
  }, [searchTerm, items]);

  useEffect(() => {
    catChangeHandler(catID);
  }, [parts]);

  if (pathname == "/inventory/bcategory") {
    return (
      <Card>
        <CardHeader className="flex-row w-full items-center justify-between border-b">
          <CardTitle className="w-fit">
            <h3>Brand Categories</h3>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-wrap justify-around mt-5 ">
          {brandCategories?.map((bcat) => {
            return (
              <Card
                key={bcat.brand_catid}
                className=" overflow-hidden w-40 m-2 space-y-4"
              >
                <CardHeader className="bg-red-500  text-white p-3 ">
                  <CardTitle className="text-center">
                    {bcat.category_name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="w-40">
                  <img src={BACK_API + bcat.image_path} />
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>
    );
  } else if (pathname == "/inventory/brands") {
    return (
      <Card>
        <CardHeader className="flex-row w-full items-center justify-between border-b">
          <CardTitle className="w-fit">
            <h3>Brands</h3>
          </CardTitle>
        </CardHeader>

        <CardContent className=" flex justify-center mx-auto h-auto mt-5 overflow-y-scroll scroll-smooth ">
          <div className="flex flex-wrap">
            {brands?.map((bcat, index) => {
              return (
                <Card
                  key={index}
                  className=" overflow-hidden w-40 m-2 space-y-4"
                >
                  <CardHeader className="bg-red-500  text-white p-3 ">
                    <CardTitle className="text-center">
                      {bcat.brand_name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="w-40 h-28 object-cover">
                    <img src={BACK_API + bcat.image_path} className="w-full" />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  } else if (pathname == "/inventory/stocks") {
    return (
      <div className="  mx-auto py-10 flex flex-col ">
        <div className=" pt-2 mb-3">
          <ul className="flex p-1 space-x-4  border-b justify-start">
            <li
              className={`${
                -1 == catID ? "bg-red-500 text-white" : ""
              } hover:bg-red-500 hover:text-white px-2 py-1 cursor-pointer rounded-sm`}
              key={96548}
              onClick={() => catChangeHandler(-1)}
            >
              All Items
            </li>
            {brandCategories?.map((cat, index) => (
              <li
                className={`${
                  cat.brand_catid == catID ? "bg-red-500 text-white" : ""
                } hover:bg-red-500 hover:text-white px-2 py-1 cursor-pointer rounded-sm`}
                key={index}
                onClick={() => catChangeHandler(cat.brand_catid)}
              >
                {cat.category_name}
              </li>
            ))}
          </ul>
        </div>
        <Input
          type="text"
          placeholder="Search by Part Number Or Part Name"
          className="mb-4 w-full max-w-md p-2 border border-gray-300 dark:border-gray-700 rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {isLoading ? (
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[360px] w-full rounded-xl" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredStock || []}
            updateRowData={onItemUpdate}
          />
        )}
      </div>
    );
  }
};

export default Inventory;
