"use client";

import { AuthContext } from "./AuthContext";
import { useRouter } from "next/navigation";
import {ReactNode, useContext, useEffect} from "react";

type ProtectRouteProps = {
    children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectRouteProps) => {
    const context = useContext(AuthContext);

    // @ts-ignore
    const { isAuthenticated } = context;

    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
