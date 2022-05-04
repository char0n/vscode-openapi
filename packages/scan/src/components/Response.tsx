import styled from "styled-components";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import { useForm, FormProvider } from "react-hook-form";

import Parameters from "./Parameters";
import Servers from "./Servers";
import RequestBody from "./RequestBody";

import { useAppDispatch } from "../store/hooks";
import { scan } from "../store/oasSlice";

export default function Response({ response }: { response: any }) {
  const dispatch = useAppDispatch();

  return (
    <Container>
      <code>
        {response.statusCode} {response.statusMessage}
      </code>
      <Headers rawHeaders={response.rawHeaders} />
      <code>{response.body}</code>
    </Container>
  );
}

function Headers({ rawHeaders }: { rawHeaders: any }) {
  const headers = [];
  for (let i = 0; i < rawHeaders.length; i += 2) {
    headers.push([rawHeaders[i], rawHeaders[i + 1]]);
  }
  return (
    <>
      {headers.map(([name, value], index) => (
        <div>
          <code>{name}</code> <code>{value}</code>
        </div>
      ))}
    </>
  );
}

const Container = styled.div``;
