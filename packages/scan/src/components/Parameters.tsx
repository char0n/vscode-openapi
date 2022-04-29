import styled from "styled-components";
import type { OasParameter, OasParameterLocation, ParametersMap } from "@xliic/common";
import Parameter from "./Parameter";

export default function Parameters({ parameters }: { parameters: ParametersMap }) {
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
  parameters: OasParameter[];
}) {
  if (parameters.length === 0) {
    return null;
  }

  return (
    <div>
      <Heading>{location} parameters</Heading>
      {parameters.map((parameter) => (
        <Parameter key={`${location}-${parameter.name}`} parameter={parameter} />
      ))}
    </div>
  );
}

const Heading = styled.div`
  border-bottom: 1px solid rgba(38, 50, 56, 0.3);
  margin: 1em 0px;
  color: rgba(38, 50, 56, 0.5);
  text-transform: uppercase;
`;
