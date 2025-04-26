import React, { useCallback, useEffect, useState } from "react";
import { getRoles, isUserAuthorized } from "@/services/Authentication";
import { getConsumerList } from "@/services/Customers";
import { getBrandCategory, getBrands, getPartList } from "@/services/Inventory";
import { Item } from "@/components/pages/inventory/columns";
import { useNavigate } from "react-router";

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
  parts: Item[] | undefined;
  roles: UserRole[] | undefined;
  fetchParts: Function;
  setParts: React.Dispatch<Item[]>;
  fetchBrandCategory: Function;
  fetchBrands: Function;
};

export type userData = {
  role: string;
  userId: number;
  email: string;
  fullname: string;
  ActiveSince: string;
};

export type UserRole = {
  role_id: string;
  role_name: string;
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
  const [roles, setRoles] = useState<UserRole[] | undefined>(undefined);
  const [parts, setParts] = useState<Item[]>();
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log("Authenting User");
      const response = await isUserAuthorized();
      console.log(response);
      if (response && response.status === "success") {
        setIsAuth(true);
        setUser(response.userData); // Assuming response.data is of type userData
      } else if (response && response.status === "401") {
        setIsLoading(false);
        setIsAuth(false);
        setError(response.message);
        console.log("Authenting Completed");
        return;
      }
      console.log("Authenting Completed");
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
      const response = await getConsumerList();
      if (response && response.status === "success") {
        setCustomers(response.data);
      } else if (response && response.status === "401") {
        setIsAuth(false);
        navigate("/login");
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const fetchBrandCategory = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getBrandCategory();
      if (response && response.status === "success") {
        setBrandCategories(response.data as BrandCategory[]);
      } else if (response && response.status === "401") {
        setIsAuth(false);
        navigate("/login");
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
      if (response && response.status === "success") {
        setBrands(response.data as Brand[]);
      } else if (response && response.status === "401") {
        setIsAuth(false);
        navigate("/login");
        setError(response.message);
      }
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  }, []);

  const fetchRoles = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getRoles();

      if (response && response.status === "success") {
        setRoles(response.data as UserRole[]);
      } else if (response && response.status === "401") {
        setIsAuth(false);
        navigate("/login");
        setError(response.message || "");
      }
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  }, []);

  const fetchParts = useCallback(async (catID: Number) => {
    try {
      const res = await getPartList(catID);
      setParts(res.data);
    } catch (err) {
      throw new Error("Somthing went wrong.");
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuth) {
      fetchConsumer();
    }
  }, [fetchConsumer, isAuth]);

  useEffect(() => {
    if (isAuth) {
      fetchBrandCategory();
      fetchBrands();
      fetchParts(-1);
      fetchRoles();
    }
  }, [fetchBrandCategory, fetchRoles, fetchBrands, isAuth, fetchParts]);

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
        fetchBrandCategory,
        brands,
        setBrands,
        fetchBrands,
        parts,
        fetchParts,
        setParts,
        roles,
      }}
    >
      {children}
    </Store.Provider>
  );
};

export default StoreProvider;
