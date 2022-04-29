import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

import type { OasParameter } from "@xliic/common";

export default function Parameter({ parameter }: { parameter: OasParameter }) {
  return (
    <FloatingLabel className="mb-3" label={parameter.name}>
      <Form.Control type="text" placeholder="foo" />
    </FloatingLabel>
  );
}
