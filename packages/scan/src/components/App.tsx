import styled from "styled-components";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import ThemeStyles from "@xliic/web-theme/ThemeStyles";
import Fo from "./Fo";

function App() {
  const theme = useAppSelector((state) => state.theme);
  const { parameters, path, method, oas, config } = useAppSelector((state) => state.oas);
  //const dispatch = useAppDispatch();

  console.log("params", path);
  return (
    <>
      <ThemeStyles theme={theme} />
      <Container>
        {path !== undefined && (
          <Fo oas={oas} parameters={parameters} config={config} path={path!} method={method!} />
        )}
      </Container>
    </>
  );
}

const Container = styled.div``;

export default App;
