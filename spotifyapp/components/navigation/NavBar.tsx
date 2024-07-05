import Link from "next/link";
import Wrapper from "../others/Wrapper";
import styles from "./navbar.module.scss";
import { useEffect } from "react";
import path from "path";
export default function NavBar() {
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
        <nav className={styles.nav}>
            <Wrapper>
                <div className={styles.nav__navBox}>
                    <p className={styles.nav__navTitle}>SpotifyApp</p>
                    <ul className={styles.nav__navMenu}>
                        {navData.map((data, index) => (
                            <li
                                key={data.id}
                                className={styles.nav__navLinkMenu}
                            >
                                <Link
                                    className={styles.nav__navLink}
                                    href={data.path}
                                >
                                    {data.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </Wrapper>
        </nav>
    );
}
