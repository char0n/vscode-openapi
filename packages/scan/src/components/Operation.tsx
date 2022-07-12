import styled from "styled-components";
import Form from "react-bootstrap/Form";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";

import Servers from "./Servers";
import RequestBody from "./RequestBody";

import { HttpMethod } from "@xliic/common/http";
import { BundledOpenApiSpec, getOperation, OasRequestBody } from "@xliic/common/oas30";
import { deref } from "@xliic/common/jsonpointer";
import { getParameters } from "../util";
import OperationHeader from "./OperationHeader";
import ParameterGroup from "./parameters/ParameterGroup";

function Operation({
  oas,
  path,
  method,
  defaultValues,
  onSubmit,
  buttonText,
}: {
  oas: BundledOpenApiSpec;
  path: string;
  method: HttpMethod;
  defaultValues: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  buttonText: string;
}) {
  const parameters = getParameters(oas, path, method);
  const operation = getOperation(oas, path, method);
  const requestBody = deref<OasRequestBody>(oas, operation?.requestBody);

  const methods = useForm({
    mode: "onBlur",
    defaultValues,
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  return (
    <Container>
      <FormProvider {...methods}>
        <Form>
          <OperationHeader
            method={method}
            path={path}
            onSubmit={handleSubmit(onSubmit)}
            buttonText={buttonText}
          />
          <Servers name="server" servers={oas?.servers} />
          <Tabs className="m-1">
            {requestBody !== undefined && (
              <Tab eventKey="body" title="Body">
                <RequestBody oas={oas} requestBody={requestBody} />
              </Tab>
            )}
            {hasParameters(parameters.path) && (
              <Tab eventKey="path" title="Path">
                <ParameterGroup oas={oas} group={parameters.path} />
              </Tab>
            )}
            {hasParameters(parameters.query) && (
              <Tab eventKey="query" title="Query">
                <ParameterGroup oas={oas} group={parameters.query} />
              </Tab>
            )}
            {hasParameters(parameters.header) && (
              <Tab eventKey="header" title="Header">
                <ParameterGroup oas={oas} group={parameters.header} />
              </Tab>
            )}
            {hasParameters(parameters.cookie) && (
              <Tab eventKey="cookie" title="Cookie">
                <ParameterGroup oas={oas} group={parameters.cookie} />
              </Tab>
            )}
          </Tabs>
        </Form>
      </FormProvider>
    </Container>
  );
}

function hasParameters(parameters?: Record<string, unknown>) {
  return parameters !== undefined && Object.keys(parameters).length > 0;
}

const Container = styled.div``;

export default Operation;
