import Login from "./components/pages/Login";
import { Route, Routes, Navigate } from "react-router";
import ProtectedRoute from "./components/security/ProtectedRoute";
import Home from "./components/pages/Home";
import { Store } from "./store/Store";
import { useContext } from "react";
import Loading from "./components/ui/Loading";
import Dashboard from "./components/pages/Dashboard";
import Consumer from "./components/pages/consumer/page";
import Inventory from "./components/pages/inventory/page";
import Sale from "./components/pages/sales/page";
function App() {
  const context = useContext(Store);
  if (!context) {
    return <Loading />;
  }

  const { isAuth, isLoading } = context;
  if (isLoading) {
    return <Loading />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" />} />
        {/* Redirect to dashboard */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="consumers" element={<Consumer />} />
        <Route path="inventory">
          <Route element={<Navigate to="/bcategory" />} />{" "}
          {/* Default sub-route */}
          <Route path="bcategory" element={<Inventory />} />
          <Route path="brands" element={<Inventory />} />
          <Route path="stocks" element={<Inventory />} />
        </Route>
        <Route path="sale">
          <Route element={<Navigate to="/add-sale" />} />{" "}
          {/* Default sub-route */}
          <Route path="add-sale" element={<Sale />} />
          <Route path="history" element={<Consumer />} />
          <Route path="reports" element={<Consumer />} />
        </Route>
        <Route path="*" element={<Dashboard />} />
      </Route>

      <Route
        path="/login"
        element={isAuth ? <Navigate to={"/"} /> : <Login />}
      />
    </Routes>
  );
}

export default App;
