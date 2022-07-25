import styled from "styled-components";
import { HttpResponse } from "@xliic/common/http";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import { createSchema } from "../../store/oasSlice";
import { useAppDispatch } from "../../store/hooks";

export default function Body({ response }: { response: HttpResponse }) {
  const body = formatBody(response);
  const dispatch = useAppDispatch();

  const isJson = isJsonResponse(response);

  return (
    <>
      <Container>
        {isJson && (
          <Button
            variant="secondary"
            onClick={() => dispatch(createSchema({ response: JSON.parse(response.body!) }))}
          >
            Generate schema
          </Button>
        )}
      </Container>
    </>
  );
}

const Container = styled.div`
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0 0.25rem;
  font-family: monospace;
`;
function isJsonResponse(response: HttpResponse): boolean {
  for (const [name, value] of response.headers) {
    if (name.toLowerCase() === "content-type" && value.includes("json")) {
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
