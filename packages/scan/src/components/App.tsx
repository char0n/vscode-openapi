import styled from "styled-components";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import ThemeStyles from "@xliic/web-theme/ThemeStyles";
import Fo from "./Fo";

function App() {
  const theme = useAppSelector((state) => state.theme);
  const { parameters, requestBody, path, method, oas, config } = useAppSelector(
    (state) => state.oas
  );
  //const dispatch = useAppDispatch();

  return (
    <>
      <ThemeStyles theme={theme} />
      <Container>
        {path !== undefined && (
          <Fo
            oas={oas}
            parameters={parameters}
            requestBody={requestBody}
            config={config}
            path={path!}
            method={method!}
          />
        )}
      </Container>
    </>
  );
}

const Container = styled.div``;

export default App;
