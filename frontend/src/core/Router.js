import { BrowserRouter, Routes, Route } from "react-router-dom";
import Validator from "./Validator";
import { AuthProvider } from "src/bin/authProvider";
import BaseLayout from "./BaseLayout";

const RouteProvider = ({ routes }) => {
  const strictRoutes = routes.filter((route) => route.strict);
  const nonStrictRoutes = routes.filter((route) => !route.strict);
  const strictRoutesWithValidator = strictRoutes.map((route) => ({
    ...route,
    component: <Validator>{route.component}</Validator>,
  }));
  const finalRoutes = [...strictRoutesWithValidator, ...nonStrictRoutes];
  return (
    <AuthProvider>
      <BrowserRouter>
        <BaseLayout>
          <Routes>
            {finalRoutes.map((route, int) => (
              <Route key={int} path={route.path} element={route.component} />
            ))}
          </Routes>
        </BaseLayout>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default RouteProvider;
