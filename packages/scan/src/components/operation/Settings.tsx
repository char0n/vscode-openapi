import styled from "styled-components";
import * as Checkbox from "@radix-ui/react-checkbox";
import { TryitConfig } from "@xliic/common/messages/tryit";
import { ThemeColors } from "@xliic/common/theme";
import { Check } from "@xliic/web-icons";

import { saveConfig } from "../../store/oasSlice";
import { useAppDispatch } from "../../store/hooks";

import { useFormContext, useWatch } from "react-hook-form";

export default function Settings({ config }: { config: TryitConfig }) {
  const dispatch = useAppDispatch();

  const { control } = useFormContext();

  const server = useWatch({
    control,
    name: "server",
  }) as string;

  const url = new URL(server);
  const hostname = url.hostname.toLowerCase();
  const ignore = config.insecureSslHostnames.includes(hostname);
  const isSSL = url.protocol === "https:";

  return (
    <Container>
      {isSSL && (
        <Item>
          Ignore SSL errors when connecting to {hostname}
          <StyledCheckbox
            checked={ignore}
            onCheckedChange={(checked) => {
              if (checked) {
                dispatch(saveConfig({ type: "configSslIgnoreAdd", hostname }));
              } else {
                dispatch(saveConfig({ type: "configSslIgnoreRemove", hostname }));
              }
            }}
          >
            <StyledIndicator>
              <Check />
            </StyledIndicator>
          </StyledCheckbox>
        </Item>
      )}
    </Container>
  );
}

const StyledCheckbox = styled(Checkbox.Root)`
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(${ThemeColors.checkboxBackground});
  border-radius: 4px;
  border-color: var(${ThemeColors.checkboxBorder});
  border-width: 1px;
  border-style: solid;
`;

const StyledIndicator = styled(Checkbox.Indicator)`
  fill: var(${ThemeColors.checkboxForeground});
`;

const Container = styled.div`
  margin-left: 0.25rem;
  margin-right: 0.25rem;
`;

const Item = styled.div`
  display: flex;
`;
