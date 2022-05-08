import styled from "styled-components";
import Button from "react-bootstrap/Button";

import { useAppDispatch } from "../store/hooks";
import { goToPage } from "../store/oasSlice";
import { HttpResponsePayload } from "../../../common/src/messages/scan";

export default function Response({ response }: { response: HttpResponsePayload }) {
  const dispatch = useAppDispatch();

  return (
    <Container>
      <p>
        <code>
          HTTP {response.httpVersion} {response.statusCode} {response.statusMessage}
        </code>
      </p>
      <p>
        <Headers headers={response.headers} />
      </p>
      <p>
        <code>{response.body}</code>
      </p>
      <Button variant="primary" onClick={() => dispatch(goToPage("request"))}>
        Back
      </Button>
    </Container>
  );
}

function Headers({ headers }: { headers: HttpResponsePayload["headers"] }) {
  return (
    <>
      {headers.map(([name, value], index) => (
        <div key={index}>
          <code>{name}:</code> <code>{value}</code>
        </div>
      ))}
    </>
  );
}

const Container = styled.div``;
