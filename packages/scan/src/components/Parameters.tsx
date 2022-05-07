import styled from "styled-components";
import type {
  ResolvedOasParameter,
  OasParameterLocation,
  OperationParametersMap,
} from "@xliic/common/oas30";
import Parameter from "./Parameter";
import ArrayParameter from "./ArrayParameter";
import Section from "./Section";

export default function Parameters({ parameters }: { parameters: OperationParametersMap }) {
  return (
    <>
      <ParametersBlock location="path" parameters={parameters.path} />
      <ParametersBlock location="query" parameters={parameters.query} />
      <ParametersBlock location="header" parameters={parameters.header} />
      <ParametersBlock location="cookie" parameters={parameters.cookie} />
    </>
  );
}

function ParametersBlock({
  location,
  parameters,
}: {
  location: OasParameterLocation;
  parameters: Record<string, ResolvedOasParameter>;
}) {
  if (parameters === undefined) {
    return null;
  }

  return (
    <div>
      <Section>{location} parameters</Section>
      {Object.values(parameters).map((parameter) => {
        const name = `parameters.${parameter.in}.${parameter.name}`;
        if (parameter?.schema?.type === "array") {
          return <ArrayParameter name={name} key={name} parameter={parameter} />;
        } else {
          return <Parameter key={name} name={name} parameter={parameter} />;
        }
      })}
    </div>
  );
}
