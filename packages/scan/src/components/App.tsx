import styled from "styled-components";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { scan } from "../store/oasSlice";
import ThemeStyles from "@xliic/web-theme/ThemeStyles";
import Parameters from "./Parameters";

function App() {
  const theme = useAppSelector((state) => state.theme);
  const oas = useAppSelector((state) => state.oas);
  const dispatch = useAppDispatch();

  return (
    <>
      <ThemeStyles theme={theme} />
      <Container>
        <Badge>{oas.method?.toUpperCase()}</Badge>
        <code> {oas.path}</code>
        <Parameters parameters={oas.parameters} />
        <Form.Control as="textarea" rows={5} className="mb-3" />
        <Button variant="primary" type="submit" onClick={() => dispatch(scan("foo"))}>
          Submit
        </Button>
      </Container>
    </>
  );
}

const Container = styled.div``;

export default App;
