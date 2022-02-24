import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";

import { OperationReport } from "../types";

function Operation(props: { path: string; op: string; operation: OperationReport }) {
  const { path, op, operation } = props;
  return (
    <Card key={`${path}-${op}`} style={{ margin: "1em" }}>
      <Card.Body>
        <Card.Title>
          <Badge>{op}</Badge> {path}
        </Card.Title>
      </Card.Body>
    </Card>
  );
}

export default Operation;
