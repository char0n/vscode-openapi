import { ScanReport } from "../types";
import OperationReport from "./OperatoinReport";

function Report({ report }: { report: ScanReport["report"] }) {
  return (
    <>
      {report.map((report) => (
        <OperationReport report={report} />
      ))}
    </>
  );
}

export default Report;
