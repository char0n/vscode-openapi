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
import { HttpRequestPayload, ScanConfig } from "@xliic/common/messages/scan";

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
    const httpRequest = makeHttpRequest(method, path, data as RequestFormData);
    console.log("data", data);
    console.log("request", httpRequest);
    dispatch(sendRequest(httpRequest));
  };

  const onTryCurl = (data: Record<string, any>) => {
    const curl = makeCurlRequest(method, path, data as RequestFormData);
    dispatch(sendRequestCurl({ curl }));
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

interface RequestFormData {
  parameters?: Record<OasParameterLocation, Record<string, any>>;
  host: string;
  requestBody?: string;
}

function makeHttpRequest(
  method: HttpMethod,
  path: string,
  data: RequestFormData
): HttpRequestPayload {
  const url = makeUrl(data.host, path, data?.parameters?.path);

  const headers = {
    "content-type": "application/javascript",
    ...data?.parameters?.header,
  };

  return {
    method,
    url,
    headers,
    body: data.requestBody,
  };
}

function makeUrl(host: string, path: string, pathParameters?: Record<string, any>): string {
  const trimmedHost = host.endsWith("/") ? host.slice(0, -1) : host;
  const substitutedPath = pathParameters ? substitutePathParams(path, pathParameters) : path;
  return trimmedHost + substitutedPath;
}

function substitutePathParams(path: string, pathParameters: Record<string, any>) {
  let substituted = path;
  for (const [name, value] of Object.entries(pathParameters)) {
    substituted = substituted.replaceAll(`{${name}}`, value as string);
  }
  return substituted;
}

function makeCurlRequest(method: HttpMethod, path: string, data: RequestFormData): string {
  const substitutedPath = data?.parameters?.path
    ? substitutePathParams(path, data.parameters.path)
    : path;
  const url = makeUrl(data.host, path, data?.parameters?.path);
  const escape = (value: string) => value.replace(/'/g, "'\\''");
  const curl = makeCurl(method, url, escape);
  const headers = makeHeaders(data?.parameters?.header ?? {}, escape).join(" ");
  const body = makeBody(data.requestBody!, escape);
  return `${curl} ${headers} ${body}`;
}

// FIXME -H This option only changes the actual word used in the HTTP request, it does not alter the way curl behaves.
// So for example if you want to make a proper HEAD request, using -X HEAD will not suffice. You need to use the --head option.
function makeCurl(method: HttpMethod, url: string, escape: Function): string {
  return `curl -v -X ${method.toUpperCase()} '${escape(url)}'`;
}

function makeHeaders(headers: Record<string, any>, escape: Function): string[] {
  return Object.entries(headers).map(([key, value]) => `-H '${escape(key)}: ${escape(value)}'`);
}

function makeBody(body: string, escape: Function): string {
  return `-d '${escape(body)}'`;
}
