import { createRoutesFromElements, Route } from "react-router";
import { createBrowserRouter } from "react-router-dom";

import { AppRoute } from "@/app/routes/appRoute";
import { ActivateAccountPage } from "@/app/routes/authentication/activateAccount/ActivateAccountPage";
import { AuthenticationPage } from "@/app/routes/authentication/AuthenticationPage";
import { LoginPage } from "@/app/routes/authentication/login/LoginPage";
import { RegisterPage } from "@/app/routes/authentication/register/RegisterPage";
import { ResetPasswordPage } from "@/app/routes/authentication/resetPassword/ResetPasswordPage";
import { Home } from "@/app/routes/home/Home";
import { NotFoundPage } from "@/app/routes/notFound/NotFoundPage";
import { Root } from "@/app/routes/root/Root";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Root />}>
            <Route path={AppRoute.HOME} element={<Home />} />

            <Route path={AppRoute.AUTHENTICATION} element={<AuthenticationPage />}>
                <Route path={AppRoute.LOGIN} element={<LoginPage />} />
                <Route path={AppRoute.REGISTER} element={<RegisterPage />} />
                <Route path={AppRoute.ACTIVATE_ACCOUNT} element={<ActivateAccountPage />} />
                <Route path={AppRoute.RESET_PASSWORD} element={<ResetPasswordPage />} />
                <Route path={AppRoute.LOGOUT} element={null} />
            </Route>

            <Route path={AppRoute.NOT_FOUND} element={<NotFoundPage />} />
        </Route>
    )
);
