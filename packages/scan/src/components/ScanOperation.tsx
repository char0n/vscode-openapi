import {
  BundledOpenApiSpec,
  HttpMethod,
  OperationParametersMap,
  OasRequestBody,
} from "@xliic/common/oas30";
import { ScanConfig } from "@xliic/common/messages/scan";
import { useAppDispatch } from "../store/hooks";

import Fo from "./Fo";

export default function ScanOperation({
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

  const scan = (data: Record<string, any>) => {
    console.log("data", data);
  };

  return (
    <>
      <Fo
        oas={oas}
        parameters={parameters}
        requestBody={requestBody}
        config={config}
        path={path}
        method={method}
        onSubmit={scan}
        buttonText="Update Scan Configuration"
      />
    </>
  );
}
