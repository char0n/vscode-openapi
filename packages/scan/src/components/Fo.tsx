import styled from "styled-components";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";

import Parameters from "./Parameters";

import {
  BundledOpenApiSpec,
  HttpMethod,
  OasParameterLocation,
  ParameterConfiguration,
  ParametersMap,
  BundledParametersMap,
  BundledOasParameter,
  OasSchema,
  deref,
} from "@xliic/common";

import { useForm, FormProvider } from "react-hook-form";

function Fo({
  parameters,
  config,
  path,
  method,
  oas,
}: {
  oas: BundledOpenApiSpec;
  config: ParameterConfiguration;
  parameters: ParametersMap;
  path: string;
  method: HttpMethod;
}) {
  console.log("config", config);

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
          <Parameters parameters={bundledParameters} />
          <Form.Control as="textarea" rows={5} className="mb-3" />
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

const parameterToConfigMap: Record<OasParameterLocation, keyof ParameterConfiguration> = {
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
