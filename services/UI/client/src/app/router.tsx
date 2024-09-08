import { createRoutesFromElements, Route } from "react-router";
import { createBrowserRouter } from "react-router-dom";

import { Home } from "@/app/routes/home/Home";
import { Root } from "@/app/routes/root/Root";
import { Routes } from "@/app/routes/routes";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path={Routes.ROOT} element={<Root />}>
            <Route path={Routes.HOME} element={<Home />} />
            <Route path={Routes.LOGIN} element={null} />
            <Route path={Routes.LOGOUT} element={null} />
            <Route path={Routes.REGISTER} element={null} />
        </Route>
    )
);
