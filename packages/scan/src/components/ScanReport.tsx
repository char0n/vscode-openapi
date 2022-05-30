import styled from "styled-components";
import Button from "react-bootstrap/Button";

import { useAppDispatch } from "../store/hooks";
import { goToPage } from "../store/oasSlice";
import ScanIssues from "./ScanIssues";
import HappyPath from "./HappyPath";
import { HttpMethod } from "@xliic/common/oas30";

export default function ScanReport({
  scanReport,
  path,
  method,
}: {
  scanReport: any;
  path: string;
  method: HttpMethod;
}) {
  const dispatch = useAppDispatch();

  const happyPath = scanReport.paths?.[path]?.[method]?.["happyPaths"]?.[0];
  const issues = scanReport.paths?.[path]?.[method]?.["issues"];
  const error = scanReport?.paths?.[path]?.[method]?.happyPaths[0]?.endStateError;

  return (
    <Container>
      <HappyPath happyPath={happyPath} />
      <ScanIssues issues={issues} error={error} />
      <Button variant="primary" onClick={() => dispatch(goToPage("scanOperation"))}>
        Back
      </Button>
    </Container>
  );
}

const Container = styled.div``;
