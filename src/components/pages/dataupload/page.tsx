import { useLocation } from "react-router";
import ImportData from "./import";
import ApproveData from "./approval";
import ExportData from "./export";

const Data = () => {
  const { pathname } = useLocation();

  if (pathname == "/data/import") {
    return <ImportData />;
  } else if (pathname == "/data/approve") {
    return <ApproveData />;
  } else if (pathname == "/data/export") {
    return <ExportData />;
  }
};

export default Data;
