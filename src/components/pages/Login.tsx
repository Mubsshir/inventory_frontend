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
import { postSignInRequest } from "@/services/Authentication";
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
  const [tip, setTip] = useState("");
  const context = useContext(Store);

  const navigate = useNavigate();
  if (!context) {
    return <p>Loading....</p>;
  }

  const { setIsAuth, setUser } = context;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const maxAttempts = 6;
    const delay = 2000; // 8 seconds
    let attempt = 1;
    let status = "";
    setIsLoading(true);
    setError(""); // clear any previous errors

    while (attempt <= maxAttempts) {
      try {
        const result = await postSignInRequest(
          values.username,
          values.password
        );
        status = result.message;
        if (result.status === "success") {
          setIsAuth && setIsAuth(true);
          setUser && setUser(result.userData);

          navigate("/");
          return;
        } else if (result.message === "Invalid Username/Password") {
          setIsAuth && setIsAuth(false);
          setError(result.message);
          setIsLoading(false);
          break;
        }
        setIsAuth && setIsAuth(false);
        // failed attempt
        setError(`Attempt ${attempt} failed: ${result.message}`);
      } catch (err) {
        setError(`Attempt ${attempt} failed: Something went wrong.`);
      }

      if (attempt > 1) {
        setTip(
          "💡 Tip: The backend is hosted on Azure. If the service was idle, it may take a few seconds to respond. Please wait, or let the system retry a few times automatically."
        );
      }
      attempt++;

      if (attempt <= maxAttempts) {
        setError(`Attempt: ${attempt} Auto Retrying 🌏 ...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    if (status === "Invalid Username/Password") {
      return;
    }
    // All attempts failed
    setIsLoading(false);
    setError(
      `Login failed after ${maxAttempts} attempts. Please try again later.`
    );
  }

  useEffect(() => {
    setTimeout(() => {
      setError("");
    }, 3000);
  }, [setError]);

  useEffect(() => {
    setTimeout(() => {
      setTip("");
    }, 9000);
  }, [setTip]);

  return (
    <section className="w-full min-h-screen flex-col flex items-center justify-center bg-gray-100 px-4">
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
          {}
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
                  {tip.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-2 font-bold">
                      {tip}
                    </p>
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
