"use client";
import Link from "next/link";
import BurgerBtn from "./BurgerBtn";
import styles from "./navbarmobile.module.scss";
import { useState } from "react";

export default function NavBarMobile() {
    const [open, isOpen] = useState<boolean>(false);
    const navData = [
        {
            id: "1",
            name: "Recent Tracks",
            path: "/tracks",
        },
        {
            id: "2",
            name: "Currently Playing",
            path: "/active",
        },
        {
            id: "3",
            name: "User Playlists",
            path: "/playlists",
        },
        {
            id: "4",
            name: "Saved Tracks",
            path: "/savedTracks?page=1",
        },
        {
            id: "5",
            name: "Statistics",
            path: "/statistics",
        },
    ];
    return (
        <>
            <BurgerBtn open={open} isOpen={isOpen} />
            <nav
                className={styles.nav}
                style={
                    open
                        ? { transform: "translateX(0)" }
                        : { transform: "translateX(100%)" }
                }
            >
                <ul className={styles.nav__navMenu}>
                    {navData.map((data, index) => (
                        <li
                            key={parseInt(data.id)}
                            className={[
                                styles.nav__navLinkMenu,
                                open ? styles.nav__navLinkAnimation : "",
                            ].join(" ")}
                            style={{ animationDelay: "." + index + "s" }}
                        >
                            <Link
                                className={styles.nav__navLink}
                                href={data.path}
                                onClick={() => isOpen(false)}
                            >
                                {data.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    );
}
