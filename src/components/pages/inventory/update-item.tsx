/**
 * ------------------------------------------------------------------
 * File: Columns Configuration
 * Author: Mubasshir Khan
 * Date: 26-Jan-2025
 * ------------------------------------------------------------------
 * Column configuration for React Table
 * ------------------------------------------------------------------
 **/

"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Store } from "@/store/Store";
import { useContext } from "react";
import { useToast } from "@/hooks/use-toast";
import { updatePart } from "@/services/Inventory";

const formSchema = z.object({
  new_qty: z.any(),
  new_price: z.any(),
});

const UpdateItem: React.FC<{
  closeDialog: Function;
  price: any;
  qty: any;
  part_id: number;
}> = ({ closeDialog, price, qty, part_id }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      new_qty: qty || 0,
      new_price: price || 0,
    },
  });

  const context = useContext(Store);
  const { toast } = useToast();

  if (!context) {
    return <p>Loading....</p>;
  }
  const { setIsLoading, isLoading } = context;
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading && setIsLoading(false);
      const item_to_update = {
        part_id: part_id,
        stock: values.new_qty,
        price: values.new_price,
      };
      const result = await updatePart(item_to_update);
      if (result && result.status == "success") {
        toast({
          title: "Success",
          description: "Item Updated",
        });
      } else {
        toast({
          title: "Fail",
          description: result?.message,
        });
      }
      setIsLoading && setIsLoading(false);
      closeDialog();
      return;
    } catch (err) {
      closeDialog();
      toast({
        title: "Error",
        description: "Somthing went wrong",
      });
      setIsLoading && setIsLoading(false);
    }
  }

  return (
    <Card className="mx-auto h-fit  bg-white select-none">
      <CardHeader>
        <CardTitle className="text-center">Update Item</CardTitle>
        <CardContent className="p-0 ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4   rounded-sm mt-3 "
            >
              <FormField
                control={form.control}
                name="new_qty"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel className="">Update Quantity</FormLabel>
                    <FormControl>
                      <Input
                        className="w-20 ml-2 text-center"
                        type="number"
                        min={qty}
                        placeholder="new_qty"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="new_price"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel className="">Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="w-20 ml-2 text-center"
                        placeholder="Price"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className={`disabled:cursor-wait  bg-red-500 w-full  `}
                type="submit"
                disabled={isLoading}
              >
                Update Item
              </Button>
            </form>
          </Form>
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default UpdateItem;
