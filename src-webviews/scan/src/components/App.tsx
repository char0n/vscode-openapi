import { useAppSelector, useAppDispatch } from "../hooks";
import { goToLine, openLink } from "../hostActions";
import Report from "./Report";

function App() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme);
  const report = useAppSelector((state) => state.report.filteredReport);

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

  console.log("do", report);

  return (
    <>
      <style>{style}</style>
      <Report report={report} />
    </>
  );
}

export default App;
