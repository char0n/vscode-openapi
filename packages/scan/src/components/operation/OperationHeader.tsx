import styled from "styled-components";
import Button from "react-bootstrap/Button";
import { HttpMethod } from "@xliic/common/http";
import { ThemeColors } from "@xliic/common/theme";

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
        <Path>{path}</Path>
      </Operation>
      <Submit variant="primary" className="m-1" onClick={onSubmit}>
        {buttonText}
      </Submit>
    </Container>
  );
}

const Submit = styled(Button)``;

const Path = styled.div`
  font-familiy: monospace;
  padding: 0.5rem;
`;

const Method = styled.div`
  background-color: var(${ThemeColors.buttonSecondaryBackground});
  color: var(${ThemeColors.buttonSecondaryForeground});
  padding: 0.5rem 1rem;
  border-right: 1px solid var(${ThemeColors.border});
`;

const Operation = styled.div`
  border: 1px solid var(${ThemeColors.border});
  border-radius: 0.375rem;
  margin: 0.25rem;
  display: flex;
  overflow: hidden;
  flex: 1;
`;

const Container = styled.div`
  display: flex;
`;
