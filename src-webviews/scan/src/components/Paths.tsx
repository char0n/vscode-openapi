import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";

import { ScanReport } from "../types";
import Operation from "./Operation";

function Paths(props: { paths: ScanReport["paths"] }) {
  return (
    <>
      {Object.entries(props.paths)
        .map(([pathId, pathReport]) =>
          Object.entries(pathReport).map(([opId, opReport]) => (
            <Operation path={pathId} op={opId} operation={opReport} />
          ))
        )
        .reduce((c, acc) => c.concat(acc), [])}
    </>
  );
}

export default Paths;
