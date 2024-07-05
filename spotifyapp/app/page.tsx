'use client'
import { useState, useEffect } from "react";
import { redirect, useSearchParams } from 'next/navigation'
import styles from "./login.module.scss"
export default function Login() {
	const AUTH_URL = "/api/login";
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false) 
	const [loading, setLoading] = useState<boolean>(true)
	
	useEffect(() => {
        const token = localStorage.getItem("access_token");
		console.log(token)
        if (token && token != "undefined") {
            setIsLoggedIn(true);
        }
		// if (isLoggedIn) {
		// 	redirect('/tracks');
		// }
		// setLoading(false)
    }, []);
	
	useEffect(() => {
		if (isLoggedIn) {
			redirect('/tracks');
		}
		setLoading(false)
	}, [isLoggedIn, redirect]);
	if (!loading) {
		return isLoggedIn ? (
			<></>
		):(
			<div className={styles.box}>
				<div className={styles.box__shadowImg}></div>
				<a className={styles.box__button} href={AUTH_URL}>
					Login with Spotify
				</a>
			</div>
		)
	}
}
