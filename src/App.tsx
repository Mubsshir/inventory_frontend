import { useContext } from "react";
import Loading from "./components/ui/Loading";
import Login from "./components/pages/Login";
import { Store } from "./store/Store";

import MainPage from "./components/pages/main-page";

function App() {
  const context = useContext(Store);
  if (!context) return <Loading />;

  const { isAuth, isLoading } = context;
  console.log(isAuth)
  if (isLoading) return <Loading />;



  if (isAuth) return <MainPage isAuth={isAuth || false} />;
  else return <Login />;
}

export default App;
