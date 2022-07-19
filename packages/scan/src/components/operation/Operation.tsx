import styled from "styled-components";
import Form from "react-bootstrap/Form";

import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";

import Servers from "../Servers";

import { HttpMethod } from "@xliic/common/http";
import { BundledOpenApiSpec, getOperation, OasRequestBody } from "@xliic/common/oas30";
import { deref } from "@xliic/common/jsonpointer";
import { getParameters } from "../../util";
import OperationHeader from "./OperationHeader";
import OperationTabs from "./OperationTabs";

export default function Operation({
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
          <OperationTabs oas={oas} requestBody={requestBody} parameters={parameters} />
        </Form>
      </FormProvider>
    </Container>
  );
}

const Container = styled.div``;
