import { ScanResponses } from "@xliic/common/messages/scan";

export interface HostApplication {
  postMessage(message: ScanResponses): void;
}
