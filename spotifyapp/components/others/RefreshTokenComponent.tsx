"use client"
import React from "react";
import { useEffect } from "react";
import { useSearchParams } from 'next/navigation'
import axios, { AxiosError } from "axios";

const RefreshTokenComponent = ({children}: {children: React.ReactNode})=>{
    const searchParams = useSearchParams()
    useEffect(()=>{ 
        const checkAndUpdateToken =async ()=>{
            if((!localStorage.getItem("access_token") || localStorage.getItem("access_token") == "null" || localStorage.getItem("access_token") == "undefined") && searchParams.get("access_token")){
                localStorage.setItem("access_token",searchParams.get("access_token") as string);
            } else {
            
            }
        };

        checkAndUpdateToken();        

    },[]);
    return (
        <>
        {children}
        </>
    )
};

export default RefreshTokenComponent;
