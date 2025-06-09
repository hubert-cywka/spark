"use client";

import React, { PropsWithChildren } from "react";

import { TwoFactorAuthenticationProvider } from "@/features/auth/components/TwoFactorAuthenticationProvider";

type DashboardProviderProps = PropsWithChildren;

export const DashboardProvider = ({ children }: DashboardProviderProps) => {
    return <TwoFactorAuthenticationProvider>{children}</TwoFactorAuthenticationProvider>;
};
