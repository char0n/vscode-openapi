import styled from "styled-components";
import { useAppSelector } from "../store/hooks";
import ThemeStyles from "@xliic/web-theme/ThemeStyles";
import Response from "./Response";
import Error from "./Error";
import Example from "./Example";
import BarChart from "./BarChart";
import ScanOperation from "./ScanOperation";
import TryOperation from "./TryOperation";
import CurlOperation from "./CurlOperation";

type Data = {
  label: string;
  value: number;
};

const data: Data[] = [
  { label: "Foo", value: 48 },
  { label: "Bar", value: 18 },
  { label: "Baz", value: 34 },
];

function App() {
  const theme = useAppSelector((state) => state.theme);
  const { parameters, requestBody, path, method, oas, config, page, response, error } =
    useAppSelector((state) => state.oas);

  return (
    <>
      <ThemeStyles theme={theme} />
      {/*<Example width={200} height={200}/>*/}
      {/*<BarChart width={500} height={400} data={data} />*/}

      <Container>
        {page === "scanOperation" && (
          <ScanOperation
            oas={oas}
            parameters={parameters}
            requestBody={requestBody}
            config={config}
            path={path!}
            method={method!}
          />
        )}
        {page === "tryOperation" && (
          <TryOperation
            oas={oas}
            parameters={parameters}
            requestBody={requestBody}
            config={config}
            path={path!}
            method={method!}
          />
        )}
        {page === "curlOperation" && (
          <CurlOperation
            oas={oas}
            parameters={parameters}
            requestBody={requestBody}
            config={config}
            path={path!}
            method={method!}
          />
        )}
        {page === "response" && <Response response={response!} />}
        {page === "error" && <Error error={error!} />}
      </Container>
    </>
  );
}

const Container = styled.div``;

export default App;
