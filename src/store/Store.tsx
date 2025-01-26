import React, { useCallback, useEffect, useState } from "react";
import { isUserAuthorized } from "@/services/Authentication";
import { getConsumerList } from "@/services/Customers";
import { getBrandCategory, getBrands } from "@/services/Inventory";

type StoreTypes = {
  isAuth?: boolean;
  user?: userData; // Change to the correct user type
  setIsAuth?: React.Dispatch<React.SetStateAction<boolean>>; // Correct type for setIsAuth
  isLoading?: boolean;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>; // Correct type for setIsLoading
  setUser?: React.Dispatch<React.SetStateAction<userData | undefined>>; // Correct type for setUser
  setCustomers?: React.Dispatch<React.SetStateAction<Customer[] | undefined>>;
  customers?: Customer[];
  error: string;
  fetchConsumer: Function;
  brandCategories: BrandCategory[] | undefined;
  setBrandCategories: React.Dispatch<
    React.SetStateAction<BrandCategory[] | undefined>
  >;
  brands: Brand[] | undefined;
  setBrands: React.Dispatch<React.SetStateAction<Brand[] | undefined>>;
};

export type userData = {
  role: string;
  userId: number;
  email: string;
  fullname: string;
};

export type Customer = {
  cnsr_id: number;
  name: string;
  email: string;
  mobile: string;
  address: string;
};

export type BrandCategory = {
  brand_catid: number;
  category_name: string;
  image_path: string;
};

export type Brand = {
  brand_id: number;
  brand_name: string;
  image_path: string;
};

export const Store = React.createContext<StoreTypes | null>(null);

const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<userData | undefined>(undefined); // Correct type for user state
  const [error, setError] = useState<string>("");
  const [customers, setCustomers] = useState<Customer[] | undefined>(undefined);
  const [brandCategories, setBrandCategories] = useState<
    BrandCategory[] | undefined
  >(undefined);
  const [brands, setBrands] = useState<Brand[] | undefined>(undefined);

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

  const fetchConsumer = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getConsumerList();
      if (response && response.status === "success") {
        setCustomers(response.data);
      } else if (response && response.status === "401") {
        setError(response.message);
      }
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  }, []);

  const fetchBrandCategory = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getBrandCategory();
      if (response && response.status === "success") {
        setBrandCategories(response.data as BrandCategory[]);
        console.log(response);
      } else if (response && response.status === "401") {
        setError(response.message);
      }
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  }, []);

  const fetchBrands = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getBrands();
      console.log(response);
      if (response && response.status === "success") {
        setBrands(response.data as Brand[]);
      } else if (response && response.status === "401") {
        setError(response.message);
      }
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuth) {
      fetchConsumer();
      fetchBrandCategory();
      fetchBrands();
    }
  }, [fetchConsumer, fetchBrandCategory, fetchBrands, isAuth]);

  return (
    <Store.Provider
      value={{
        isAuth,
        setIsAuth,
        isLoading,
        setIsLoading,
        user,
        setUser,
        error,
        setCustomers,
        customers,
        fetchConsumer,
        brandCategories,
        setBrandCategories,
        brands,
        setBrands,
      }}
    >
      {children}
    </Store.Provider>
  );
};

export default StoreProvider;
