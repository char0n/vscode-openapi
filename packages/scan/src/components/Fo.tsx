import styled from "styled-components";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";

import Parameters from "./Parameters";
import Servers from "./Servers";
import RequestBody from "./RequestBody";

import {
  BundledOpenApiSpec,
  HttpMethod,
  OasParameterLocation,
  ParameterConfiguration,
  ParametersMap,
  BundledParametersMap,
  OasSchema,
  deref,
  OasRequestBody,
} from "@xliic/common";

import { useForm, FormProvider } from "react-hook-form";

function Fo({
  parameters,
  requestBody,
  config,
  path,
  method,
  oas,
}: {
  oas: BundledOpenApiSpec;
  config: ParameterConfiguration;
  parameters: ParametersMap;
  requestBody?: OasRequestBody;
  path: string;
  method: HttpMethod;
}) {
  const defaultValues = generateDefaultValues(parameters, config);
  const bundledParameters = bundleParameters(oas, parameters);

  const methods = useForm({
    defaultValues,
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: any) => {
    // console.log(data);
    //dispatch(scan("foo"));
  };

  return (
    <Container>
      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Badge>{method?.toUpperCase()}</Badge>
          <code> {path}</code>
          <Servers name="servers" servers={oas.servers} />
          <Parameters parameters={bundledParameters} />
          <RequestBody name="requestBody" requestBody={requestBody} />
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </FormProvider>
    </Container>
  );
}

const Container = styled.div``;

export default Fo;

const parameterToConfigMap: Record<
  OasParameterLocation,
  keyof Omit<ParameterConfiguration, "requestBody">
> = {
  query: "queryParameters",
  path: "pathParameters",
  header: "headerParameters",
  cookie: "cookieParameters",
};

function generateDefaultValues(
  parameters: ParametersMap,
  configuration: ParameterConfiguration
): Record<string, any> {
  const values: Record<string, any> = {};
  const locations = Object.keys(parameterToConfigMap) as OasParameterLocation[];
  for (const location of locations) {
    for (const parameter of parameters[location]) {
      const value = configuration[parameterToConfigMap[parameter.in]]?.[parameter.name];
      if (value !== undefined) {
        values[`${parameter.in}/${parameter.name}`] = Array.isArray(value) ? wrap(value) : value;
      }
    }
  }

  if (configuration.requestBody !== undefined) {
    values["requestBody"] = JSON.stringify(configuration.requestBody, null, 2);
  }

  return values;
}

// arrays must be wrapped for react form hook
function wrap(array: unknown[]): unknown {
  return array.map((value) => ({ value }));
}

function bundleParameters(
  oas: BundledOpenApiSpec,
  parameters: ParametersMap
): BundledParametersMap {
  const result: BundledParametersMap = {
    query: [],
    path: [],
    cookie: [],
    header: [],
  };
  const locations = Object.keys(parameters) as OasParameterLocation[];
  for (const location of locations) {
    for (const parameter of parameters[location]) {
      const schema = deref<OasSchema>(oas, parameter.schema);
      result[location].push({ ...parameter, schema });
    }
  }
  return result;
}
