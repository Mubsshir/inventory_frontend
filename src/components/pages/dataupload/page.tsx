
import { useLocation } from "react-router";
import ImportData from "./import";

const Data = () => {
  const { pathname } = useLocation();

  if (pathname == "/data/import") {
    return <ImportData />;
  } else if (pathname == "/data/approve") {
    return (
      <div>
        <h4>Approval Data Page</h4>
      </div>
    );
  } else if (pathname == "/data/export") {
    return (
      <div>
        <h4>Export Data Page</h4>
      </div>
    );
  }
};

export default Data;
