import Link from "next/link";
import styles from "./PlayListTrackCard.module.scss";
import { useState } from "react";
import CheckBox from "./CheckBox";
import CheckBoxSavedTracks from "../savedTracks/CheckBoxSavedTracks";
interface Artist {
    name: string;
}

interface ArtistLink {
    href: string;
}

type ArtistId = string | number;

interface PlayListTrackCard {
    id: string;
    snapshot_id: string | null;
    playlistId: string | null;
    name: string;
    trackUri: string;
    artists: Artist[] | string[];
    artistLink: ArtistLink[] | string[];
    artistId: ArtistId[];
    imgLink: string;
    trackLink: string;
}

export default function PlayListTrackCard({
    name,
    snapshot_id,
    trackUri,
    artists,
    artistLink,
    artistId,
    imgLink,
    trackLink,
}: PlayListTrackCard) {
    return (
        <div className={styles.card}>
            <div className={styles.card__imgBox}>
                <a href={trackLink}>
                    <img
                        className={styles.card__img}
                        src={imgLink}
                        alt="Track Image"
                    />
                </a>
            </div>
            <div className={styles.card__infoBox}>
                <Link className={styles.card__trackName} href={trackLink}>
                    {name}
                </Link>
                <div className={styles.card__artistBox}>
                    {artists.map((artist: any, index: number) => (
                        <Link
                            key={artistId[index]}
                            className={styles.card__artistName}
                            href={artistLink[index]}
                        >
                            {artist +
                                (index !== artists.length - 1 ? ", " : "")}
                        </Link>
                    ))}
                </div>
            </div>
            {snapshot_id !== null ? (
                <CheckBox
                    trackUri={trackUri}
                    snapshot_id={snapshot_id}
                ></CheckBox>
            ) : (
                <CheckBoxSavedTracks trackId={trackUri}></CheckBoxSavedTracks>
            )}
        </div>
    );
}
