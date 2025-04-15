"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import SideImage from "/invent.jpg";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authenticateUser } from "@/services/Authentication";
import { Store } from "@/store/Store";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

const Login = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const context = useContext(Store);

  const navigate = useNavigate();
  if (!context) {
    return <p>Loading....</p>;
  }

  const { setIsAuth, setUser } = context;
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading && setIsLoading(true);
      const result = await authenticateUser(values.username, values.password);
      console.log(result);
      if (result.status === "success") {
        setIsAuth && setIsAuth(true);
        setUser && setUser(result.userData);
        navigate("/");
        return;
      }
      setError(result.message);
      setIsLoading && setIsLoading(false);
      return;
    } catch (err) {
      setError("Somthing Went Wrong.");
      setIsLoading && setIsLoading(false);
      setIsAuth && setIsAuth(true);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setError("");
    }, 3000);
  }, [setError]);
  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-5xl flex bg-white rounded-xl overflow-hidden ">
        {/* Image Section */}
        <div className="w-1/2 hidden md:block bg-gray-200">
          <img
            src={SideImage}
            alt="Side"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 md:p-8 sm:p-2 flex flex-col justify-center items-center">
          <h2 className="md:text-3xl text-xl mb-5 font-extralight">
            <span className="font-extrabold text-red-500">Inventory</span>{" "}
            Mangement System
          </h2>
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-left">
                Welcome to{" "}
                <span className="text-red-500">Inventory Manger</span>
              </CardTitle>
              <CardDescription>
                Please enter your <strong>Username</strong> and{" "}
                <strong>Password</strong> to continue.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your password"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    className="bg-red-500 w-full"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>

                  {error && (
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Login;
