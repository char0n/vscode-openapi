import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

import type { BundledOasParameter } from "@xliic/common";

export default function ArrayParameter({ parameter }: { parameter: BundledOasParameter }) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const name = `${parameter.in}/${parameter.name}`;

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control,
    name,
  });

  return (
    <>
      {fields.map((field, index) => (
        <FloatingLabel className="mb-3" key={field.id} label={parameter.name}>
          <Controller
            control={control}
            name={`${name}.${index}`}
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
      ))}
    </>
  );
}
