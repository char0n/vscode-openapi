import styled from "styled-components";
import { HttpResponse } from "@xliic/common/http";
import Dropdown from "react-bootstrap/Dropdown";
import { createSchema } from "../../store/oasSlice";
import { useAppDispatch } from "../../store/hooks";

export default function Settings() {
  return <Container>me settings</Container>;
}

const Container = styled.div`
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0 0.25rem;
  font-family: monospace;
`;
