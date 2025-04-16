import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useContext, useEffect, useState } from "react";
import { Store } from "@/store/Store";
import Loading from "@/components/ui/Loading";
import { CheckCircleIcon, CircleX } from "lucide-react";
import {
  checkUserNameAvalability,
  saveNewUser,
} from "@/services/Authentication";
import { useNavigate } from "react-router";

const userSchema = z.object({
  fullname: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
  role: z.any(),
  username: z
    .string()
    .min(4, { message: "Username must be at least 3 characters." })
    .regex(/^[a-z0-9]+$/, {
      message:
        "Only lowercase letters and numbers allowed. No spaces or special characters.",
    }),
});

export default function UserCreationForm() {
  const formUser = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      role: "",
      username: "",
    },
  });

  const [loginId, setLoginId] = useState("");
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [formError, setFormError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  // Debounce the API call
  useEffect(() => {
    const timer = setTimeout(() => {
      // Basic frontend validation before making API call
      const isValidLoginId = /^[a-z0-9]+$/.test(loginId);

      if (loginId.length > 3 && isValidLoginId) {
        checkUsernameAvailability(loginId);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [loginId]);

  // Function to check username availability from the backend
  const checkUsernameAvailability = async (username: string) => {
    try {
      const response = await checkUserNameAvalability(username);
      console.log(response);
      if (response.status == "success") {
        setIsUsernameAvailable(true);
        setErrorMessage("");
      } else {
        setIsUsernameAvailable(false);
        setErrorMessage("Username is already taken.");
      }
    } catch (error) {
      setIsUsernameAvailable(false);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  const context = useContext(Store);
  if (!context) {
    return <Loading />;
  }

  const { roles } = context;

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    try {
      if (!isUsernameAvailable) {
        return;
      }

      let fullname = values.fullname;
      let username = values.username;
      let email = values.email;
      let password = values.password;
      let roleid = values.role;

      if (roleid == "-1") {
        setFormError("Please Selcet Brand");
        return;
      }

      const UserData = { fullname, username, email, roleid, password };

      const result = await saveNewUser(UserData);
      console.log(result);
      if (result) {
        if (result.status == "success") {
          navigate("/dashboard");
          toast({
            title: result.status,
            description: "User Saved Successfully",
          });
        }
        toast({ title: result.status, description: result.message });
        return;
      }
    } catch (error) {
      toast({ title: "Error", description: error as string });
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Create New User</h2>

      <Form {...formUser}>
        <form onSubmit={formUser.handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name */}
          <FormField
            control={formUser.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* UserName */}
          <FormField
            control={formUser.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl className="relative">
                  <section>
                    <Input
                      placeholder="Enter username"
                      {...field}
                      value={loginId}
                      onChange={(e) => {
                        const value = e.target.value.trim();
                        field.onChange(value); // tells react-hook-form about the change
                        setLoginId(value); // updates your local state for availability check
                      }}
                    />

                    {isUsernameAvailable && loginId.length > 3 ? (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      </div>
                    ) : (
                      loginId.length > 3 && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                          <CircleX className="w-5 h-5 text-red-500" />
                        </div>
                      )
                    )}
                  </section>
                </FormControl>
                <FormMessage />
                {!isUsernameAvailable && (
                  <div className="text-red-500">{errorMessage}</div>
                )}
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={formUser.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={formUser.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Role */}
          <FormField
            control={formUser.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>

                <FormControl>
                  <select
                    id="cat"
                    className="w-full outline-0 border rounded-lg py-2 px-1 my-2"
                    {...field}
                  >
                    <option value="-1" className="font-bold">
                      Select Role
                    </option>
                    {roles?.map((role, idx) => (
                      <option key={idx} value={role.role_id}>
                        {role.role_name}
                      </option>
                    ))}
                  </select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Upload + Preview */}
          <div className="flex items-start gap-6">
            <div className="flex-1 space-y-2">
              <Button type="submit" className="bg-red-500 w-full">
                Create User
              </Button>
              {formError.length > 0 && (
                <h3 className="font-bold my-2 text-red-500">{formError}</h3>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
