/**
 * ------------------------------------------------------------------
 * File: Add Consumer Functionality
 * Author: Mubasshir Khan
 * Date: 19-Jan-2025
 * ------------------------------------------------------------------
 * this ReactJS module implements the functionality to manage
 * consumers in an intuitive and dynamic way.
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
import { saveConsumer } from "@/services/Customers";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  first_name: z.string().min(3, {
    message: "Consumer first name must be at least 3 characters.",
  }),
  last_name: z.string(),
  phone: z
    .string()
    .min(10, { message: "Phone number should be atleast 10 digit long" })
    .max(13, { message: "Phone number can only be 13 digit long" }),
  email: z.string(),
  address: z.string(),
});

const AddConsumer: React.FC<{ closeDialog?: Function; className: String }> = ({
  closeDialog,
  className,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      address: "",
      phone: "",
    },
  });

  const context = useContext(Store);
  const { toast } = useToast();

  if (!context) {
    return <p>Loading....</p>;
  }
  const { setIsLoading, isLoading, fetchConsumer } = context;
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading && setIsLoading(false);

      const result = await saveConsumer(values);
      if (result && result.status == "success") {
       
        toast({
          title: "Success",
          description: "Consumer saved",
        });
      } else {
        toast({
          title: "Fail",
          description: result?.message,
        });
      }
      closeDialog && closeDialog();
      await fetchConsumer();
      setIsLoading && setIsLoading(false);
      return;
    } catch (err) {
      closeDialog && closeDialog();
      toast({
        title: "Error",
        description: "Somthing went wrong",
      });
      setIsLoading && setIsLoading(false);
    }
  }

  return (
    <Card className={`${className} w-96 mx-auto h-fit`}>
      <CardHeader>
        <CardTitle className="text-center">Add new consumer</CardTitle>
        <CardContent className="p-0 ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4   rounded-sm mt-3"
            >
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last name" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter cosnumer phone number"
                        type="number"
                        maxLength={13}
                        minLength={10}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter cosnumer email address"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter cosnumer  address"
                        type="text"
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
                Save Consumer
              </Button>
            </form>
          </Form>
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default AddConsumer;