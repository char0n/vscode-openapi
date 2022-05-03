import styled from "styled-components";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

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
        <Field key={field.id} className="m-3">
          <FloatingLabel label={parameter.name}>
            <Controller
              control={control}
              name={`${name}.${index}.value`}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Form.Control type="text" onChange={onChange} value={value} ref={ref} />
              )}
            />
          </FloatingLabel>
          <Button className="m-1" variant="light">
            +
          </Button>
          <Button className="m-1" variant="light">
            -
          </Button>
        </Field>
      ))}
    </>
  );
}

const Field = styled.div`
  display: flex;
  & > div {
    flex: 1;
  }
`;
