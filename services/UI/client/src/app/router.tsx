import { lazy, ReactNode, Suspense } from "react";
import { createRoutesFromElements, Route } from "react-router";
import { createBrowserRouter } from "react-router-dom";

import { AppRoute } from "@/app/routes/appRoute";
import { Page } from "@/components/page/Page";
import { Spinner } from "@/components/spinner/Spinner";

const AuthenticationPage = lazy(() =>
    import("@/app/routes/authentication/AuthenticationPage").then((module) => ({
        default: module.AuthenticationPage,
    }))
);

const ActivateAccountPage = lazy(() =>
    import("@/app/routes/authentication/activateAccount/ActivateAccountPage").then((module) => ({
        default: module.ActivateAccountPage,
    }))
);

const LoginPage = lazy(() =>
    import("@/app/routes/authentication/login/LoginPage").then((module) => ({
        default: module.LoginPage,
    }))
);

const RegisterPage = lazy(() =>
    import("@/app/routes/authentication/register/RegisterPage").then((module) => ({
        default: module.RegisterPage,
    }))
);

const ResetPasswordPage = lazy(() =>
    import("@/app/routes/authentication/resetPassword/ResetPasswordPage").then((module) => ({
        default: module.ResetPasswordPage,
    }))
);

const HomePage = lazy(() =>
    import("@/app/routes/home/Home").then((module) => ({
        default: module.Home,
    }))
);

const NotFoundPage = lazy(() =>
    import("@/app/routes/notFound/NotFoundPage").then((module) => ({
        default: module.NotFoundPage,
    }))
);

const Root = lazy(() =>
    import("@/app/routes/root/Root").then((module) => ({
        default: module.Root,
    }))
);

const withSuspense = (children: ReactNode) => (
    <Suspense
        fallback={
            <Page>
                <Spinner size="3" />
            </Page>
        }
    >
        {children}
    </Suspense>
);

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={withSuspense(<Root />)}>
            <Route path={AppRoute.HOME} element={withSuspense(<HomePage />)} />

            <Route path={AppRoute.AUTHENTICATION} element={withSuspense(<AuthenticationPage />)}>
                <Route path={AppRoute.LOGIN} element={withSuspense(<LoginPage />)} />
                <Route path={AppRoute.REGISTER} element={withSuspense(<RegisterPage />)} />
                <Route path={AppRoute.ACTIVATE_ACCOUNT} element={withSuspense(<ActivateAccountPage />)} />
                <Route path={AppRoute.RESET_PASSWORD} element={withSuspense(<ResetPasswordPage />)} />
                <Route path={AppRoute.LOGOUT} element={null} />
            </Route>

            <Route path={AppRoute.NOT_FOUND} element={withSuspense(<NotFoundPage />)} />
        </Route>
    )
);
