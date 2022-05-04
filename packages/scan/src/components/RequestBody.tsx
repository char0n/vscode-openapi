import { useFormContext, Controller } from "react-hook-form";
import Form from "react-bootstrap/Form";

import type { OasRequestBody } from "@xliic/common";
import Section from "./Section";

export default function RequestBody({
  name,
  requestBody,
}: {
  name: string;
  requestBody?: OasRequestBody;
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  if (requestBody === undefined) {
    return null;
  }

  return (
    <>
      <Section>request body</Section>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <Form.Control as="textarea" rows={10} onChange={onChange} value={value} ref={ref} />
        )}
      />
    </>
  );
}
