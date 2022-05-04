import { useFormContext, Controller } from "react-hook-form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

import type { BundledOasParameter } from "@xliic/common";

export default function Parameter({
  name,
  parameter,
}: {
  name: string;
  parameter: BundledOasParameter;
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <FloatingLabel className="m-1" label={parameter.name}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <Form.Control
            type="text"
            className="is-invalid"
            onChange={onChange}
            value={value}
            ref={ref}
          />
        )}
      />
      <div className="invalid-feedback">Please choose a username.</div>
    </FloatingLabel>
  );
}
