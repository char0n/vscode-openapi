import styled from "styled-components";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import * as Tabs from "@radix-ui/react-tabs";

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
import { ThemeColors } from "@xliic/common/theme";

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
          <Tabs.Root defaultValue="body">
            <Tabs.List>
              {requestBody !== undefined && <TabButton value="body">Body</TabButton>}
              {hasParameters(parameters.path) && <TabButton value="path">Path</TabButton>}
              {hasParameters(parameters.query) && <TabButton value="query">Query</TabButton>}
              {hasParameters(parameters.header) && <TabButton value="header">Header</TabButton>}
              {hasParameters(parameters.cookie) && <TabButton value="cookie">Cookie</TabButton>}
            </Tabs.List>
            {requestBody !== undefined && (
              <Tabs.Content value="body">
                <RequestBody oas={oas} requestBody={requestBody} />
              </Tabs.Content>
            )}
            {hasParameters(parameters.path) && (
              <Tabs.Content value="path">
                <ParameterGroup oas={oas} group={parameters.path} />
              </Tabs.Content>
            )}
            {hasParameters(parameters.query) && (
              <Tabs.Content value="query">
                <ParameterGroup oas={oas} group={parameters.query} />
              </Tabs.Content>
            )}
            {hasParameters(parameters.header) && (
              <Tabs.Content value="header">
                <ParameterGroup oas={oas} group={parameters.header} />
              </Tabs.Content>
            )}
            {hasParameters(parameters.cookie) && (
              <Tabs.Content value="cookie">
                <ParameterGroup oas={oas} group={parameters.cookie} />
              </Tabs.Content>
            )}
          </Tabs.Root>
        </Form>
      </FormProvider>
    </Container>
  );
}

function hasParameters(parameters?: Record<string, unknown>) {
  return parameters !== undefined && Object.keys(parameters).length > 0;
}

const Container = styled.div``;

const TabButton = styled(Tabs.Trigger).attrs({
  className: "btn m-1",
})`
  border: 1px solid var(${ThemeColors.tabBorder});
  color: var(${ThemeColors.tabInactiveForeground});
  background-color: var(${ThemeColors.tabInactiveBackground});
  &[data-state="active"] {
    color: var(${ThemeColors.tabActiveForeground});
    background-color: var(${ThemeColors.tabActiveBackground});
  }
`;

export default Operation;
