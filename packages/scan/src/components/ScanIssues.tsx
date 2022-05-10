import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import { ExclamationCircle, Check } from "@xliic/web-icons";

function ScanIssues({ issues }: { issues: any }) {
  return (
    <>
      {issues && issues.map((issue: any, index: number) => <ScanIssue issue={issue} key={index} />)}
      {issues === undefined && <p>scan failed</p>}
    </>
  );
}

function ScanIssue({ issue }: { issue: any }) {
  return (
    <Card style={{ margin: "1em" }}>
      <Card.Body>
        <Card.Title>
          {issue.injectionDescription}{" "}
          {issue.status === "unexpected" && (
            <Badge bg="warning">
              <ExclamationCircle />
            </Badge>
          )}
        </Card.Title>
      </Card.Body>
      <ListGroup variant="flush">
        <ListGroup.Item>
          <div>
            <code>{issue.curl}</code>
          </div>
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );
}

export default ScanIssues;
