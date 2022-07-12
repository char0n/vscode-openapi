import styled from "styled-components";
import Button from "react-bootstrap/Button";
import { HttpMethod } from "@xliic/common/http";

export default function OperationHeader({
  method,
  path,
  onSubmit,
  buttonText,
}: {
  method: HttpMethod;
  path: string;
  onSubmit: any;
  buttonText: string;
}) {
  return (
    <Container>
      <Operation>
        <Method>{method.toUpperCase()}</Method>
        <Path>
          <code>{path}</code>
        </Path>
      </Operation>
      <Submit variant="primary" className="m-1" onClick={onSubmit}>
        {buttonText}
      </Submit>
    </Container>
  );
}

const Submit = styled(Button)``;

const Path = styled.div`
  padding: 0.5rem;
`;

const Method = styled.div`
  background-color: #f5f5f5;
  padding: 0.5rem 1rem;
  border-right: 1px solid #ced4da;
`;

const Operation = styled.div`
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  margin: 0.25rem;
  display: flex;
  overflow: hidden;
  flex: 1;
`;

const Container = styled.div`
  display: flex;
`;
