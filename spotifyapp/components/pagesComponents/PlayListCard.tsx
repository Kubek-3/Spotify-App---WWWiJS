import Link from "next/link";
import styles from "./playListCard.module.scss";

interface PlayListCard {
    id: string;
    name: string;
    imgLink: string;
    playListLink: string;
    onPressed: (playList: any) => void;
}

export default function PlayListCard({
    id,
    name,
    imgLink,
    playListLink,
    onPressed,
}: PlayListCard) {
    return (
        //while hover, box has lighter color and is pressable
        <div className={styles.card} onClick={() => onPressed(id)}>
            <div className={styles.card__imgBox}>
                <Link href={playListLink}>
                    <img
                        className={styles.card__img}
                        src={imgLink}
                        alt="Track Image"
                    />
                </Link>
            </div>

            <div
                className={styles.card__playListName}
                // onClick={() => onPressed(id)} this part is unnecesearry while whole box is pressable, but the text sill changes color to green
            >
                {name}
            </div>
        </div>
    );
}
