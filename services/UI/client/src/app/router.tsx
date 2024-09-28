import { createRoutesFromElements, Route } from "react-router";
import { createBrowserRouter } from "react-router-dom";

import { AppRoute } from "@/app/routes/appRoute";
import { Home } from "@/app/routes/home/Home";
import { Login } from "@/app/routes/login/Login";
import { NotFound } from "@/app/routes/notFound/NotFound";
import { Root } from "@/app/routes/root/Root";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Root />}>
            <Route path={AppRoute.HOME} element={<Home />} />
            <Route path={AppRoute.LOGIN} element={<Login />} />
            <Route path={AppRoute.REGISTER} element={null} />
            <Route path={AppRoute.LOGOUT} element={null} />
            <Route path={AppRoute.NOT_FOUND} element={<NotFound />} />
        </Route>
    )
);
