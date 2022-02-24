import { useAppSelector, useAppDispatch } from "../hooks";
import { goToLine, openLink } from "../hostActions";
import Paths from "./Paths";

function App() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme);
  const report = useAppSelector((state) => state.report);

  const cssVars = [];
  if (theme.foreground !== undefined) {
    cssVars.push(`--audit-custom-foreground: ${theme.foreground};`);
  }
  if (theme.background !== undefined) {
    cssVars.push(`--audit-custom-background: ${theme.background};`);
  }
  const style = `:root { ${cssVars.join("\n")} }
   body {
     background-color: var(--audit-background);
     color: var(--audit-foreground);
     }
  `;

  return (
    <>
      <style>{style}</style>
      <Paths paths={report.focusedPaths} />
    </>
  );
}

export default App;
