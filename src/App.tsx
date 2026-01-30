import { ThemeProvider } from "@mui/material/styles";
import Layout from "./components/Layout";
import myTheme from "./components/MyTheme";

function App() {
  return (
    <ThemeProvider theme={myTheme}>
      <Layout></Layout>
    </ThemeProvider>
  );
}

export default App;
