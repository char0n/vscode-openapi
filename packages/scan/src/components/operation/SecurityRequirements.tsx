import { useFormContext, useController } from "react-hook-form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

import type { OasSecurityScheme } from "@xliic/common/oas30";

export default function SecurityRequirements({
  name,
  schema,
}: {
  name: string;
  schema: Record<string, OasSecurityScheme>;
}) {
  if (!schema) {
    return null;
  }
  return (
    <>
      {Object.keys(schema).map((key) => (
        <SecurityRequirementSchema key={key} name={`${name}.${key}`} schema={schema[key]} />
      ))}
    </>
  );
}

function SecurityRequirementSchema({ name, schema }: { name: string; schema: OasSecurityScheme }) {
  const { control } = useFormContext();

  const {
    field,
    fieldState: { isTouched, isDirty, error },
    formState: { touchedFields, dirtyFields },
  } = useController({
    name,
    control,
    rules: {
      validate: (value) => validate(value),
    },
  });

  return (
    <>
      <FloatingLabel label={name} className="m-1">
        <Form.Control
          type="text"
          className={error ? "is-invalid" : undefined}
          onChange={field.onChange}
          onBlur={field.onBlur}
          value={field.value}
          ref={field.ref}
        />
        {error && <div className="invalid-feedback">{error.message}</div>}
      </FloatingLabel>
    </>
  );
}

function validate(value: any): any {
  return undefined; // validation passes
}
