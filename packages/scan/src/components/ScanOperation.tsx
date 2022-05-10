import {
  BundledOpenApiSpec,
  HttpMethod,
  OperationParametersMap,
  OasRequestBody,
  OasParameterLocation,
} from "@xliic/common/oas30";
import { ScanConfig } from "@xliic/common/messages/scan";
import { useAppDispatch } from "../store/hooks";
import { updateScanConfig } from "../store/oasSlice";

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
    console.log("data1", data);

    const scanConfig = makeScanConfig(method, path, data as RequestFormData);
    console.log("config1", scanConfig);
    dispatch(updateScanConfig({ path, method, config: scanConfig }));
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
        buttonText="Run Scan"
      />
    </>
  );
}

interface RequestFormData {
  parameters?: Record<OasParameterLocation, Record<string, any>>;
  host: string;
  requestBody?: string;
}

function makeScanConfig(method: HttpMethod, path: string, data: RequestFormData): ScanConfig {
  return {
    host: data.host,
    requestBody: data.requestBody,
    parameters: {
      header: {},
      query: {},
      cookie: {},
      path: {},
    },
  };
}
