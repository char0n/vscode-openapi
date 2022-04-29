import styled from "styled-components";
import Button from "react-bootstrap/Button";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import ThemeStyles from "@xliic/web-theme/ThemeStyles";
import Parameters from "./Parameters";

function App() {
  const theme = useAppSelector((state) => state.theme);
  const parameters = useAppSelector((state) => state.oas.parameters);

  return (
    <>
      <ThemeStyles theme={theme} />
      <Container>
        <Parameters parameters={parameters} />
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Container>
    </>
  );
}

const Container = styled.div`
  width: 600px;
  margin-left: 10px;
`;

export default App;
