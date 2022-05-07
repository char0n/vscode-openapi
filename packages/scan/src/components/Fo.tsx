import styled from "styled-components";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import { useForm, FormProvider } from "react-hook-form";

import Parameters from "./Parameters";
import Servers from "./Servers";
import RequestBody from "./RequestBody";

import {
  BundledOpenApiSpec,
  HttpMethod,
  OasParameterLocation,
  OperationParametersMap,
  OasRequestBody,
} from "@xliic/common/oas30";
import { ScanConfig } from "@xliic/common/messages/scan";

import { useAppDispatch } from "../store/hooks";
import { sendRequest, sendRequestCurl } from "../store/oasSlice";

function Fo({
  parameters,
  requestBody,
  config,
  path,
  method,
  oas,
}: {
  oas: BundledOpenApiSpec;
  config: ScanConfig;
  parameters: OperationParametersMap;
  requestBody?: OasRequestBody;
  path: string;
  method: HttpMethod;
}) {
  const dispatch = useAppDispatch();

  const defaultValues = generateDefaultValues(parameters, config);

  console.log("de val", { defaultValues, config });

  const methods = useForm({
    defaultValues,
  });

  const { handleSubmit } = methods;

  const onTryInternal = (data: Record<string, any>) => {
    // TODO build up request
    /*
    if (parameters.path) {
      for (const [name, value] of Object.entries(parameters.path)) {
        path = path.replaceAll(`{${name}}`, value);
      }
    }
    */
    console.log("hot data", data);
    //dispatch(sendRequest({ ...data, path, method }));
  };

  const onTryCurl = (data: any) => {
    dispatch(sendRequestCurl({ ...data, path, method }));
  };

  return (
    <Container>
      <FormProvider {...methods}>
        <Form>
          <Badge>{method?.toUpperCase()}</Badge>
          <code> {path}</code>
          <Servers name="host" servers={oas.servers} />
          <Parameters parameters={parameters} />
          <RequestBody name="requestBody" requestBody={requestBody} />
          <Button variant="primary" onClick={handleSubmit(onTryInternal)}>
            Try It
          </Button>
          <Button variant="primary" onClick={handleSubmit(onTryCurl)}>
            Curl It
          </Button>
        </Form>
      </FormProvider>
    </Container>
  );
}

const Container = styled.div``;

export default Fo;

function generateDefaultValues(
  parameters: OperationParametersMap,
  configuration: ScanConfig
): Record<string, any> {
  const values: Record<string, any> = { parameters: {} };
  const locations = Object.keys(parameters) as OasParameterLocation[];
  for (const location of locations) {
    for (const name of Object.keys(parameters[location])) {
      const value = configuration.parameters[location]?.[name];
      if (value !== undefined) {
        if (!values.parameters[location]) {
          values.parameters[location] = {};
        }
        values.parameters[location][name] = Array.isArray(value) ? wrap(value) : value;
      }
    }
  }

  if (configuration.requestBody !== undefined) {
    values["requestBody"] = JSON.stringify(configuration.requestBody, null, 2);
  }

  values["host"] = configuration.host;

  return values;
}

// arrays must be wrapped for react form hook
function wrap(array: unknown[]): unknown {
  return array.map((value) => ({ value }));
}
