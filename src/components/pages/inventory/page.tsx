import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/ui/Loading";
import { Store } from "@/store/Store";
import { useContext, useEffect, useState } from "react";
const BACK_API: string = import.meta.env.VITE_BLOB_URL;
import { useLocation } from "react-router";
import { DataTable } from "./data-table";
import { columns, Item } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";
import ImageNotAvailabe from "/ImageNotAvailabe.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  saveNewBrand,
  saveNewCategory,
  saveNewItem,
} from "@/services/Inventory";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Category name must be at least 3 characters.",
  }),
  description: z.string(),
  category_image: z.any(),
});

const formSchemaBrand = z.object({
  name: z.string().min(3, {
    message: "Category name must be at least 3 characters.",
  }),
  description: z.string(),
  brand_image: z.any(),
});

const formSchemaItem = z.object({
  name: z.string().min(3, {
    message: "Item name must be at least 3 characters.",
  }),
  code: z.string().min(4, {
    message: "Item Code must be at least 4 characters.",
  }),
  price: z.string(),
  qty: z.string(),
});

const Inventory = () => {
  console.log(BACK_API);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category_image: undefined,
    },
  });

  const formBrand = useForm<z.infer<typeof formSchemaBrand>>({
    resolver: zodResolver(formSchemaBrand),
    defaultValues: {
      name: "",
      description: "",
      brand_image: undefined,
    },
  });

  const formItem = useForm<z.infer<typeof formSchemaItem>>({
    resolver: zodResolver(formSchemaItem),
    defaultValues: {
      name: "",
      code: "",
      price: "0",
      qty: "0",
    },
  });

  const { pathname } = useLocation();
  const context = useContext(Store);
  const [image, setImage] = useState(ImageNotAvailabe);
  const [catID, setCatID] = useState<number>(-1);
  const [items, setItems] = useState<Item[]>();
  const [isOpen, setIsOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [filteredStock, setFilteredStock] = useState<Item[]>();
  const [searchTerm, setSearchTerm] = useState("");
  if (!context) {
    return <Loading />;
  }

  const {
    user,
    fetchBrandCategory,
    brandCategories,
    brands,
    fetchBrands,
    fetchParts,
    isLoading,
    parts,
    setParts,
  } = context;

  function fileChangeHandler(e: any) {
    let imageFile = URL.createObjectURL(e.target.files[0]);
    setImage(imageFile);
  }

  const catChangeHandler = (cat_id: number) => {
    setCatID(cat_id);
    if (cat_id == -1) {
      setItems(parts);
    } else {
      console.log(cat_id);

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

  const addCatHandler = async (values: z.infer<typeof formSchema>, e: any) => {
    try {
      let formData = new FormData();
      if (image !== ImageNotAvailabe) {
        formData.append("catImage", e.target.category_image.files[0]);
      }
      let catName = values.name;
      let catDesc = values.description;

      if (catName.length > 2) {
        formData.append("categoryName", catName);
        formData.append("categoryDesc", catDesc);

        //code for save form data to api
        const result = await saveNewCategory(formData);
        if (result) {
          if (result.status == "success") {
            await fetchBrandCategory();
            setIsOpen(false);
          }
          toast({ title: result.status, description: result.message });
        }
      }
    } catch (error) {
      toast({ title: "Error", description: error as string });
    }
  };

  const addBrandHandler = async (
    values: z.infer<typeof formSchemaBrand>,
    e: any
  ) => {
    try {
      e.preventDefault();
      let formData = new FormData();
      if (image !== ImageNotAvailabe) {
        formData.append("BrandImage", e.target.brand_image.files[0]);
      }
      let brandName = values.name;
      let brandDesc = values.description;

      if (brandDesc.length > 2) {
        formData.append("BrandName", brandName);
        formData.append("BrandDesc", brandDesc);

        //code for save form data to api
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }

        const result = await saveNewBrand(formData);
        if (result) {
          if (result.status == "success") {
            await fetchBrands();
            toast({
              title: result.status,
              description: "Brand Saved Successfully",
            });
            setIsOpen(false);
          }
          toast({ title: result.status, description: result.message });
          return;
        }
      } else {
        toast({
          title: "Invalid Name Length",
          description: "Brand Name Should Be 2 Chracter Long",
        });
      }
    } catch (error) {
      toast({ title: "Error", description: error as string });
    }
  };

  const addItemHandler = async (
    values: z.infer<typeof formSchemaItem>,
    e: any
  ) => {
    try {
      let ItemName = values.name;
      let ItemCode = values.code;
      let ItemPrice = values.price;
      let ItemQTY = values.qty;
      let BrandID = e.target.brand.value;
      let CatID = e.target.cat.value;

      if (BrandID == -1) {
        setFormError("Please Selcet Brand");
        return;
      }

      if (CatID == -1) {
        setFormError("Please Selcet Categroy");
        return;
      }

      const Part = { ItemName, ItemCode, ItemPrice, ItemQTY, BrandID, CatID };

      const result = await saveNewItem(Part);
      if (result) {
        if (result.status == "success") {
          await fetchParts(-1);
          setIsOpen(false);
          toast({
            title: result.status,
            description: "Item Saved Successfully",
          });
        }
        toast({ title: result.status, description: result.message });
        return;
      }
    } catch (error) {
      toast({ title: "Error", description: error as string });
    }
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

  useEffect(() => {
    setTimeout(() => {
      setFormError("");
    }, 2000);
  }, [formError]);

  if (pathname == "/inventory/bcategory" || pathname == "/inventory") {
    return (
      <Card className="relative w-full  ">
        <CardHeader className="relative flex-row w-full items-center justify-between border-b ">
          <CardTitle className=" relative w-full flex justify-between items-center ">
            <h3>Brand Categories</h3>
            {user?.role == "Admin" && (
              <Popover
                open={isOpen}
                onOpenChange={() => {
                  setIsOpen(!isOpen);
                }}
              >
                <PopoverTrigger asChild>
                  <Button>Add New Category</Button>
                </PopoverTrigger>
                <PopoverContent className=" relative sm:relative mx-auto  md:right-3 sm:right-11  right-3 w-[320px] md:w-[420px] ">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none text-red-500">
                        Create New Category
                      </h4>
                    </div>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(addCatHandler)}>
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Category name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category description</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Category description"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex items-center">
                          <div className="flex flex-col space-y-2 justify-between align-middle">
                            <div className="p-2 border rounded-lg">
                              <FormField
                                control={form.control}
                                name="category_image"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Choose Category Image</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        onChange={fileChangeHandler}
                                        type="file"
                                        name="category_image"
                                        placeholder="Choose Image for Category"
                                        accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <Button type="submit" className="w-full self-end">
                              Save Category
                            </Button>
                          </div>

                          <div className="w-[150px] h-[150px] p-3 mt-3  mb-3 flex justify-center align-middle">
                            <img
                              src={image}
                              alt="preview"
                              className="w-full h-full object-scale-down rounded-lg  "
                            />
                          </div>
                        </div>
                      </form>
                    </Form>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex w-full flex-wrap h-[620px]  justify-around pt-2 overflow-y-scroll">
          {brandCategories?.map((bcat) => {
            return (
              <Card
                key={bcat.brand_catid}
                className="  w-40 h-48 m-2 space-y-4 rounded-md overflow-hidden"
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
        <CardHeader className=" relative flex-row w-full items-center justify-between border-b ">
          <CardTitle className=" relative w-full flex justify-between items-center ">
            <h3>Brands</h3>
            {user?.role == "Admin" && (
              <Popover
                open={isOpen}
                onOpenChange={() => {
                  setIsOpen(!isOpen);
                }}
              >
                <PopoverTrigger asChild>
                  <Button>Add New Brand</Button>
                </PopoverTrigger>
                <PopoverContent className=" relative sm:relative mx-auto  md:right-3 sm:right-11  right-3 w-[320px] md:w-[420px] ">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none text-red-500">
                        Add New Brand in Inventory
                      </h4>
                    </div>
                    <Form {...formBrand}>
                      <form onSubmit={formBrand.handleSubmit(addBrandHandler)}>
                        <FormField
                          control={formBrand.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Brand Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Brand name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={formBrand.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Brand description</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Brand description"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex items-center">
                          <div className="flex flex-col space-y-2 justify-between align-middle">
                            <div className="p-2 border rounded-lg">
                              <FormField
                                control={formBrand.control}
                                name="brand_image"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Choose Brand Image</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        onChange={fileChangeHandler}
                                        type="file"
                                        name="brand_image"
                                        placeholder="Choose Image for Brand"
                                        accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <Button type="submit" className="w-full self-end">
                              Save Brand
                            </Button>
                          </div>

                          <div className="w-[150px] h-[150px] p-3 mt-3  mb-3 flex justify-center align-middle">
                            <img
                              src={image}
                              alt="preview"
                              className="w-full h-full object-scale-down rounded-lg  "
                            />
                          </div>
                        </div>
                      </form>
                    </Form>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className=" flex justify-center mx-auto h-auto mt-5  scroll-smooth ">
          <div className=" flex w-full flex-wrap h-[620px]  justify-around pt-2 overflow-y-scroll">
            {brands?.map((bcat, index) => {
              return (
                <Card
                  key={index}
                  className=" overflow-hidden w-40 h-44 m-2 space-y-4"
                >
                  <CardHeader className="bg-red-500  text-white p-3 ">
                    <CardTitle className="text-center">
                      {bcat.brand_name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="w-40 h-28 object-cover flex justify-center align-middle">
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
        <div className="px-2 mb-3">
          <CardTitle className=" relative w-full flex justify-between items-center ">
            <h3>Availabe Stock</h3>
            {user?.role == "Admin" && (
              <Popover
                open={isOpen}
                onOpenChange={() => {
                  setIsOpen(!isOpen);
                }}
              >
                <PopoverTrigger asChild>
                  <Button>Add New Item</Button>
                </PopoverTrigger>
                <PopoverContent className=" relative sm:relative mx-auto  md:right-3 sm:right-11  right-3 w-[320px] md:w-[420px] ">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none text-red-500">
                        Add New Item in Inventory
                      </h4>
                    </div>
                    <Form {...formItem}>
                      <form onSubmit={formItem.handleSubmit(addItemHandler)}>
                        <FormField
                          control={formItem.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Item Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Item name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={formItem.control}
                          name="code"
                          render={({ field }) => (
                            <FormItem className="my-2">
                              <FormLabel>Item Code</FormLabel>
                              <FormControl>
                                <Input placeholder="Item Code" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Label>Select Brand</Label>
                        <select
                          name="brand"
                          id="brand"
                          className="w-full outline-0 border rounded-lg py-2 px-1 my-2"
                        >
                          <option value="-1" className="font-bold">
                            Select Brand
                          </option>
                          {brands?.map((brand, idx) => (
                            <option key={idx} value={brand.brand_id}>
                              {brand.brand_name}
                            </option>
                          ))}
                        </select>

                        <FormLabel>Select Category</FormLabel>
                        <select
                          name="cat"
                          id="cat"
                          className="w-full outline-0 border rounded-lg py-2 px-1 my-2"
                        >
                          <option value="-1" className="font-bold">
                            Select Category
                          </option>
                          {brandCategories?.map((cat, idx) => (
                            <option key={idx} value={cat.brand_catid}>
                              {cat.category_name}
                            </option>
                          ))}
                        </select>
                        <FormField
                          control={formItem.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Item Price</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={1}
                                  step={0.1}
                                  defaultValue={0}
                                  placeholder="Item Price"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={formItem.control}
                          name="qty"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Item Quantitiy</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={1}
                                  step={1}
                                  placeholder="Item Quantity"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full self-end  mt-3">
                          Save Item
                        </Button>
                        <h3 className="font-bold my-2 text-red-500">
                          {formError}
                        </h3>
                      </form>
                    </Form>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </CardTitle>
        </div>
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
