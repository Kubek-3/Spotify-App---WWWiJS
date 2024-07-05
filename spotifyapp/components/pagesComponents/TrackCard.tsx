import Link from "next/link";
import styles1 from "./trackcard.module.scss";
import styles2 from "./trackcardcurrplay.module.scss";
interface Artist {
    name: string;
}

interface ArtistLink {
    href: string;
}

type ArtistId = string | number;

interface TrackCard {
    name: string;
    artists: Artist[];
    artistLink: ArtistLink[];
    artistId: ArtistId[];
    imgLink: string;
    trackLink: string;
    styleNumber: number;
    is_local: boolean;
}

export default function TrackCard({
    name,
    artists,
    artistLink,
    artistId,
    imgLink,
    trackLink,
    styleNumber,
    is_local,
}: TrackCard) {
    const styles = styleNumber === 1 ? styles1 : styles2;

    return (
        <a href={trackLink} className={styles.card}>
            <div className={styles.card__imgBox}>
                <img
                    className={styles.card__img}
                    src={imgLink}
                    alt="Track Image"
                />
            </div>
            <div className={styles.card__infoBox}>
                <p className={styles.card__trackName}>{name}</p>
                <div className={styles.card__artistBox}>
                    {!is_local ? (
                        <>
                            {artists.map((artist: any, index: number) => (
                                <Link
                                    key={artistId[index]}
                                    className={styles.card__artistName}
                                    href={artistLink[index]}
                                >
                                    {artist +
                                        (index !== artists.length - 1
                                            ? ", "
                                            : "")}
                                </Link>
                            ))}
                        </>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </a>
    );
}
