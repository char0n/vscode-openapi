import { ThemeState } from "./index";
import { ThemeColors } from "@xliic/common/theme";

export default function ThemeStyles({ theme }: { theme: ThemeState }) {
  return (
    <style>
      {customProps(theme)}
      {defaultStyles()}
      {bootstrapColorOverrides()}
    </style>
  );
}

function defaultStyles(): string {
  return `
  body {
    padding: 0;
    margin: 0 4px;
    background-color: var(--xliic-background);
    color: var(--xliic-foreground);
    }`;
}

function customProps(theme: ThemeState): string {
  const vars: string[] = [];

  if (theme.foreground !== undefined) {
    vars.push(`--xliic-custom-foreground: ${theme.foreground};`);
  }

  if (theme.background !== undefined) {
    vars.push(`--xliic-custom-background: ${theme.background};`);
  }

  return `:root {
    ${vars.join("\n")}
  }`;
}

function bootstrapColorOverrides(): string {
  return `#root .btn-primary {
    --bs-btn-color: var(${ThemeColors.buttonForeground});
    --bs-btn-bg: var(${ThemeColors.buttonBackground});
    --bs-btn-border-color: var(${ThemeColors.buttonBorder});
    --bs-btn-hover-color: var(${ThemeColors.buttonForeground});
    --bs-btn-hover-bg: var(${ThemeColors.buttonHoverBackground});
    --bs-btn-hover-border-color: var(${ThemeColors.buttonHoverBackground});
  }

  #root .dropdown-menu {
    --bs-dropdown-border-color: var(${ThemeColors.dropdownBorder});
    --bs-dropdown-bg: var(${ThemeColors.dropdownBackground});
    --bs-dropdown-link-color: var(${ThemeColors.dropdownForeground});
  }

  #root .form-control, #root .form-select {
    color: var(${ThemeColors.inputForeground});
    background-color: var(${ThemeColors.inputBackground});
    border: 1px solid var(${ThemeColors.border});
  }
  `;
}
