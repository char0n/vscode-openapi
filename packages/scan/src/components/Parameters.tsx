import type { OasParameter, OasParameterLocation, ParametersMap } from "@xliic/common";
import Parameter from "./Parameter";

export default function Parameters({ parameters }: { parameters: ParametersMap }) {
  return (
    <>
      <div>params</div>
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
      <div>{location}</div>
      {parameters.map((parameter) => (
        <Parameter key={`${location}-${parameter.name}`} parameter={parameter} />
      ))}
    </div>
  );
}
