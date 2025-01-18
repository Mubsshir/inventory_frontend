"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
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
import { useContext } from "react";
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

  const context = useContext(Store);
  const navigate = useNavigate();
  if (!context) {
    return <p>Loading....</p>;
  }
  const { setIsAuth, setUser, setIsLoading, isLoading } = context;
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading && setIsLoading(true);
      const result = await authenticateUser(values.username, values.password);
      if (result.status == "success") {
        setIsAuth && setIsAuth(true);
        setUser && setUser(result.userData);
        navigate("/");
      }
      setIsLoading && setIsLoading(false);
      return;
    } catch (err) {
      setIsLoading && setIsLoading(false);
      setIsAuth && setIsAuth(true);
    }
  }

  return (
    <div className="w-full h-lvh flex items-center  justify-center">
      <Card className="w-96 mx-auto h-fit">
        <CardHeader>
          <CardTitle className="text-center">Login to your Account</CardTitle>
          <CardContent className="p-0 ">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4   rounded-sm mt-3"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
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
                  className={`disabled:cursor-wait  bg-red-500 w-full  `}
                  type="submit"
                  disabled={isLoading}
                >
                  Login
                </Button>
              </form>
            </Form>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
};

export default Login;
