import Login from "./components/pages/Login";
import { Route, Routes, Navigate } from "react-router";
import ProtectedRoute from "./components/security/ProtectedRoute";
import Home from "./components/pages/Home";
import { Store } from "./store/Store";
import { useContext } from "react";
import Loading from "./components/ui/Loading";

function App() {
  const context = useContext(Store);
  if (!context) {
    return <Loading />;
  }

  const { isAuth,isLoading } = context;
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
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route
        path="/login"
        element={isAuth ? <Navigate to={"/"} /> : <Login />}
      />
    </Routes>
  );
}

export default App;
