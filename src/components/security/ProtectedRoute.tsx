import { Navigate } from "react-router";
import { useContext } from "react";
import { Store } from "@/store/Store";
import Loading from "../ui/Loading";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const context = useContext(Store);

  // Handle the case when context is null
  if (!context) {
    // Optionally, you could show a loading spinner or some other fallback
    return <Loading />
  }

  const { isAuth, isLoading } = context;

  if (isLoading) {
    // Optionally, show a loading message or spinner while checking auth
    return <Loading />
  }

  if (!isAuth) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ message: "Unauthorized access, Please Login again" }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;
