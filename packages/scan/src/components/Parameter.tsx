import { useFormContext, Controller } from "react-hook-form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

import type { BundledOasParameter } from "@xliic/common";

export default function Parameter({ parameter }: { parameter: BundledOasParameter }) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const name = `${parameter.in}/${parameter.name}`;

  return (
    <FloatingLabel className="mb-3" label={parameter.name}>
      <Controller
        control={control}
        name={name}
        defaultValue=""
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <Form.Control
            type="text"
            onChange={onChange}
            value={value}
            ref={ref}
            isInvalid={errors.username}
            placeholder="Enter user name"
          />
        )}
      />
    </FloatingLabel>
  );
}
