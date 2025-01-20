import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/ui/Loading";
import { Store } from "@/store/Store";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { SeparatorHorizontal } from "lucide-react";
import { useContext } from "react";
const BACK_API: string = import.meta.env.VITE_LOCAL_URL;
import { useLocation } from "react-router";

const Inventory = () => {
  const { pathname } = useLocation();
  const context = useContext(Store);
  if (!context) {
    return <Loading />;
  }

  const { brandCategories } = context;

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
    return <Card>Brands</Card>;
  } else if (pathname == "/inventory/stocks") {
    return <Card>Stocks</Card>;
  }
};

export default Inventory;
