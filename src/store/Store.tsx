import React, { useCallback, useEffect, useState } from "react";
import { isUserAuthorized } from "@/services/Authentication";

type StoreTypes = {
  isAuth?: boolean;
  user?: userData; // Change to the correct user type
  setIsAuth?: React.Dispatch<React.SetStateAction<boolean>>; // Correct type for setIsAuth
  isLoading?: boolean;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>; // Correct type for setIsLoading
  setUser?: React.Dispatch<React.SetStateAction<userData | undefined>>; // Correct type for setUser
  error: string;
  page:string;
  setPage:React.Dispatch<React.SetStateAction<string>>
};

export type userData = {
  role: string;
  userId: number;
  email: string;
  fullname: string;
};

export const Store = React.createContext<StoreTypes | null>(null);

const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<userData | undefined>(undefined); // Correct type for user state
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState<string>("Welcome");

  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await isUserAuthorized();
      if (response && response.status === "success") {
        setIsAuth(true);
        setUser(response.userData); // Assuming response.data is of type userData
      } else if (response && response.status === "401") {
        setIsAuth(false);
        setError(response.message);
      }
      setIsLoading(false);
    } catch (err: any) {
      // Ensure that err is typed correctly
      setIsAuth(false);
      setError(err.message);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Store.Provider
      value={{
        isAuth,
        setIsAuth,
        isLoading,
        setIsLoading,
        user,
        setUser,
        error,page, setPage
      }}
    >
      {children}
    </Store.Provider>
  );
};

export default StoreProvider;
