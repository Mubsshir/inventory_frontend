import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/ui/Loading";
import { Store } from "@/store/Store";
import { useCallback, useContext, useEffect, useState } from "react";
const BACK_API: string = import.meta.env.VITE_LOCAL_URL;
import { useLocation } from "react-router";
import { DataTable } from "./data-table";
import { columns, Item } from "./columns";
import { getPartList } from "@/services/Inventory";
import { Skeleton } from "@/components/ui/skeleton";

const Inventory = () => {
  const { pathname } = useLocation();
  const context = useContext(Store);
  const [parts, setParts] = useState<Item[] | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [catID, setCatID] = useState<Number>(-1);

  if (!context) {
    return <Loading />;
  }

  const fetchParts = useCallback(async (catID: Number) => {
    try {
      setLoading(true);
      const res = await getPartList(catID);
      setParts(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }, []);

  const { brandCategories, brands } = context;

  useEffect(() => {
    if (pathname == "/inventory/stocks") {
      fetchParts(catID);
    }
  }, [catID]);

  if (pathname == "/inventory/bcategory") {
    return (
      <Card>
        <CardHeader className="flex-row w-full items-center justify-between border-b">
          <CardTitle className="w-fit">
            <h3>Brand Categories</h3>
          </CardTitle>
          <Button className="w-fit bg-red-500">Add New Brand Category</Button>
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
          <Button className="w-fit bg-red-500">Add New Brand Category</Button>
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
              onClick={() => {
                setCatID(-1);
              }}
            >
              All Items
            </li>
            {brandCategories?.map((cat, index) => (
              <li
                className={`${
                  cat.brand_catid == catID ? "bg-red-500 text-white" : ""
                } hover:bg-red-500 hover:text-white px-2 py-1 cursor-pointer rounded-sm`}
                key={index}
                onClick={() => {
                  setCatID(cat.brand_catid);
                }}
              >
                {cat.category_name}
              </li>
            ))}
          </ul>
        </div>
        {loading ? (
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[360px] w-full rounded-xl" />
          </div>
        ) : (
          <DataTable columns={columns} data={parts || []} />
        )}
      </div>
    );
  }
};

export default Inventory;
