import styled from "styled-components";
import Button from "react-bootstrap/Button";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { goBack } from "../store/oasSlice";
import { HttpResponse } from "@xliic/common/http";

export default function Response() {
  const dispatch = useAppDispatch();

  const response = useAppSelector((state) => state.oas.response!);

  const body = formatBody(response);

  return (
    <Container>
      <Section>
        HTTP {response.httpVersion} {response.statusCode} {response.statusMessage}
      </Section>
      <Section>
        <Headers headers={response.headers} />
      </Section>
      <Section>{body}</Section>
      <Button variant="primary" onClick={() => dispatch(goBack())}>
        Back
      </Button>
    </Container>
  );
}

function Headers({ headers }: { headers: HttpResponse["headers"] }) {
  return (
    <>
      {headers.map(([name, value], index) => (
        <div key={index}>
          <span>{name}:</span> <span>{value}</span>
        </div>
      ))}
    </>
  );
}

const Section = styled.div`
  white-space: pre-wrap;
  margin-top: 10px;
  margin-bottom: 10px;
  font-family: monospace;
`;

const Container = styled.div``;

function isJsonResponse(response: HttpResponse): boolean {
  for (const [name, value] of response.headers) {
    if (name.toLowerCase() === "content-type" && value.startsWith("application/json")) {
      return true;
    }
  }
  return false;
}

function formatBody(response: HttpResponse): string | undefined {
  if (!isJsonResponse(response) || response.body === undefined) {
    return response.body;
  }

  try {
    return JSON.stringify(JSON.parse(response.body), null, 2);
  } catch (e) {
    return response.body;
  }
}
