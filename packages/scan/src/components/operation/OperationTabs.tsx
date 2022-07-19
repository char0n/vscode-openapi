import styled from "styled-components";

import * as Tabs from "@radix-ui/react-tabs";

import { useEffect, useState } from "react";

import RequestBody from "../RequestBody";

import { BundledOpenApiSpec, OasRequestBody, OperationParametersMap } from "@xliic/common/oas30";

import ParameterGroup from "../parameters/ParameterGroup";
import { ThemeColors } from "@xliic/common/theme";

export default function OperationTabs({
  oas,
  requestBody,
  parameters,
}: {
  oas: BundledOpenApiSpec;
  requestBody?: OasRequestBody;
  parameters: OperationParametersMap;
}) {
  const tabs = [
    {
      id: "body",
      title: "Body",
      content: <RequestBody oas={oas} requestBody={requestBody} />,
      enabled: requestBody !== undefined,
    },
    {
      id: "path",
      title: "Path",
      content: <ParameterGroup oas={oas} group={parameters.path} />,
      enabled: hasParameters(parameters.path),
    },
    {
      id: "query",
      title: "Query",
      content: <ParameterGroup oas={oas} group={parameters.query} />,
      enabled: hasParameters(parameters.query),
    },
    {
      id: "header",
      title: "Header",
      content: <ParameterGroup oas={oas} group={parameters.header} />,
      enabled: hasParameters(parameters.header),
    },
    {
      id: "cookie",
      title: "Cookie",
      content: <ParameterGroup oas={oas} group={parameters.cookie} />,
      enabled: hasParameters(parameters.cookie),
    },
  ];

  const activeId = tabs.filter((tab) => tab.enabled)?.[0]?.id;

  if (activeId === undefined) {
    return null;
  }

  const [activeTab, setActiveTab] = useState(activeId);

  // TODO resets tabs on any change, perhaps should do it when switching beween operation os files?
  useEffect(() => {
    setActiveTab(tabs.filter((tab) => tab.enabled)?.[0].id);
  }, [oas]);

  return (
    <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
      <TabList>
        {tabs
          .filter((tab) => tab.enabled)
          .map((tab) => (
            <TabButton key={tab.id} value={tab.id}>
              {tab.title}
            </TabButton>
          ))}
      </TabList>
      {tabs.map((tab) => (
        <Tabs.Content key={tab.id} value={tab.id}>
          {tab.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}

function hasParameters(parameters?: Record<string, unknown>) {
  return parameters !== undefined && Object.keys(parameters).length > 0;
}

const TabList = styled(Tabs.List)`
  margin: 0.25rem;
  display: flex;
  :after {
    border-bottom: 1px solid var(${ThemeColors.tabBorder});
    content: "";
    flex: 1;
  }
`;

const TabButton = styled(Tabs.Trigger)`
  border-radius: 0.375rem 0.375rem 0 0;
  border: 1px solid var(${ThemeColors.tabBorder});
  padding: 0.25rem 1rem;
  color: var(${ThemeColors.tabInactiveForeground});
  background-color: var(${ThemeColors.tabInactiveBackground});

  &[data-state="active"] {
    color: var(${ThemeColors.tabActiveForeground});
    background-color: var(${ThemeColors.tabActiveBackground});
    border-bottom: 1px transparent solid;
  }
`;
