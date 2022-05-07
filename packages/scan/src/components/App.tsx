import styled from "styled-components";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import ThemeStyles from "@xliic/web-theme/ThemeStyles";
import Fo from "./Fo";
import Response from "./Response";
import Error from "./Error";
import Example from "./Example";

function App() {
  const theme = useAppSelector((state) => state.theme);
  const { parameters, requestBody, path, method, oas, config, page, response, error } =
    useAppSelector((state) => state.oas);

  //const dispatch = useAppDispatch();

  return (
    <>
      <ThemeStyles theme={theme} />
      {/*<Example width={200} height={200} />*/}
      <Container>
        {page === "request" && path !== undefined && (
          <Fo
            oas={oas}
            parameters={parameters}
            requestBody={requestBody}
            config={config}
            path={path!}
            method={method!}
          />
        )}
        {/*page === "curl" && response !== undefined && <Curl response={response} />*/}
        {page === "response" && response !== undefined && <Response response={response} />}
        {page === "error" && error !== undefined && <Error error={error} />}
      </Container>
    </>
  );
}

const Container = styled.div``;

export default App;
