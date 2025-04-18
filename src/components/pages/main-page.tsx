import { FC } from "react";
import Login from "./Login";

import { Route, Routes, Navigate } from "react-router";

import HomeLayout from "../layouts/home-layout";
import Dashboard from "./Dashboard";
import Consumer from "./consumer/page";
import Inventory from "./inventory/page";
import Sale from "./sales/page";
import ProfileCard from "./Account/page";
import Data from "./dataupload/page";
import UserCreationForm from "./Account/usercreation";
import ProtectedRoute from "../security/ProtectedRoute";

const MainPage: FC<{ isAuth: boolean }> = ({ isAuth }) => {
  return (
    <Routes>
      {isAuth ? (
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomeLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="usercreation" element={<UserCreationForm />} />
          <Route path="info" element={<ProfileCard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="consumers" element={<Consumer />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="inventory/bcategory" element={<Inventory />} />
          <Route path="inventory/brands" element={<Inventory />} />
          <Route path="inventory/stocks" element={<Inventory />} />
          <Route path="sale" element={<Sale />} />
          <Route path="sale/add-sale" element={<Sale />} />
          <Route path="sale/history" element={<Sale />} />
          <Route path="data" element={<Data />} />
          <Route path="data/import" element={<Data />} />
          <Route path="data/approve" element={<Data />} />
          <Route path="data/export" element={<Data />} />
          <Route path="*" element={<Dashboard />} />
        </Route>
      ) : (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      )}
    </Routes>
  );
};

export default MainPage;
