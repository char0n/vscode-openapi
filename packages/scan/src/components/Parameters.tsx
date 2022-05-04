import styled from "styled-components";
import type {
  BundledOasParameter,
  OasParameterLocation,
  BundledParametersMap,
} from "@xliic/common";
import Parameter from "./Parameter";
import ArrayParameter from "./ArrayParameter";
import Section from "./Section";

export default function Parameters({ parameters }: { parameters: BundledParametersMap }) {
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
  parameters: BundledOasParameter[];
}) {
  if (parameters.length === 0) {
    return null;
  }

  return (
    <div>
      <Section>{location} parameters</Section>
      {parameters.map((parameter) => {
        const name = `${parameter.in}/${parameter.name}`;
        if (parameter?.schema?.type === "array") {
          return <ArrayParameter name={name} key={name} parameter={parameter} />;
        } else {
          return <Parameter key={name} name={name} parameter={parameter} />;
        }
      })}
    </div>
  );
}
