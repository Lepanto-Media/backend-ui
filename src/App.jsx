import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ProSidebarProvider } from "react-pro-sidebar";
import { checkUser } from "./components/pages/Login/checkUser";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { privateRoutes, publicRoutes } from "./routes";

function App() {
  const [theme, colorMode] = useMode();
  const user = checkUser();

  const router = createBrowserRouter([
    user ? privateRoutes() : {},
    ...publicRoutes(),
  ]);

  return (
    <>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <ProSidebarProvider>
            <CssBaseline />
            <RouterProvider router={router} />
          </ProSidebarProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>
  );
}

export default App;
