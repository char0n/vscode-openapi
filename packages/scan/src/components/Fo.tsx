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

function Fo({
  parameters,
  requestBody,
  config,
  path,
  method,
  oas,
  onSubmit,
  buttonText,
}: {
  oas: BundledOpenApiSpec;
  config: ScanConfig;
  parameters: OperationParametersMap;
  requestBody?: OasRequestBody;
  path: string;
  method: HttpMethod;
  onSubmit: (data: Record<string, any>) => void;
  buttonText: string;
}) {
  const defaultValues = generateDefaultValues(parameters, config);

  const methods = useForm({
    defaultValues,
  });

  const { handleSubmit } = methods;

  return (
    <Container>
      <FormProvider {...methods}>
        <Form>
          <Badge>{method?.toUpperCase()}</Badge>
          <code> {path}</code>
          <Servers name="host" servers={oas.servers} />
          <Parameters parameters={parameters} />
          <RequestBody name="requestBody" requestBody={requestBody} />
          <Button variant="primary" onClick={handleSubmit(onSubmit)}>
            {buttonText}
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
