import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";

import { OperationReport as Data } from "../types";

function OperationReport({ report }: { report: Data }) {
  return (
    <Card key={`${report.path}-${report.method}`} style={{ margin: "1em" }}>
      <Card.Body>
        <Card.Title>
          <Badge>{report.method}</Badge> {report.path}
        </Card.Title>
      </Card.Body>
      <ListGroup variant="flush">
        {report.issues.map((issue) => (
          <ListGroup.Item>
            <div>{issue.description}</div>
            <div>
              <pre>{issue.curl}</pre>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
}

export default OperationReport;
