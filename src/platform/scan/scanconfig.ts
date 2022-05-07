import { ScanConfig } from "@xliic/common/messages/scan";

export function convertScanConfig(config: any): ScanConfig {
  return {
    parameters: {
      query: config.queryParameters,
      path: config.pathParameters,
      header: config.headerParameters,
      cookie: config.cookieParameters,
    },
    requestBody: config.requestBody,
    host: config.host,
  };
}
