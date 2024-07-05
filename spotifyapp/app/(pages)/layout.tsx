"use client";
import NavBar from "@/components/navigation/NavBar";
import NavBarMobile from "@/components/navigation/NavBarMobile";
import { redirect, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
export default function PagesLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchData = async () => {
            const accessToken = searchParams.get("access_token");
            if (accessToken) {
                localStorage.setItem("access_token", accessToken);
                setIsLoggedIn(true);
            } else if (
                localStorage.getItem("access_token") &&
                localStorage.getItem("access_token") != "undefined"
            ) {
                setIsLoggedIn(true);
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);

    if (isLoading) {
        return null;
    }

    if (!isLoggedIn) {
        redirect("/api/login");
    }

    return (
        <>
            <NavBarMobile />
            <NavBar />
            {children}
        </>
    );
}
