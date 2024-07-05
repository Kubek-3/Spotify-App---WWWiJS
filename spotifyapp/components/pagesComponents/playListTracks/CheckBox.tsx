import { useEffect, useState } from 'react';
import styles from './checkbox.module.scss';

interface CheckBox {
    trackUri: string;
    snapshot_id: string;
}

export default function CheckBox({ trackUri, snapshot_id }: CheckBox) {
    const sessionStorageKey = 'selectedTracks';
    const [isSelected, setIsSelected] = useState(false);
    const [boxStyle, setBoxStyle] = useState(styles.box);

    useEffect(() => {
        setBoxStyle(styles.box);
        setIsSelected(false);
        const storedTracks = sessionStorage.getItem(sessionStorageKey);
        if (storedTracks) {
            const parsedTracks = JSON.parse(storedTracks);
            const tracksArray = Array.isArray(parsedTracks.tracks)
                ? parsedTracks.tracks
                : [];
            const isTrackSelected = tracksArray.some(
                (track: { uri: string }) => track.uri === trackUri
            );
            setIsSelected(isTrackSelected);
            setBoxStyle(isTrackSelected ? styles.box__clicked : styles.box);
        }
    }, [trackUri]);

    const handleClick = () => {
        const storedTracks = sessionStorage.getItem(sessionStorageKey);
        let tracksArray = [];

        if (storedTracks) {
            const parsedTracks = JSON.parse(storedTracks);
            tracksArray = Array.isArray(parsedTracks.tracks)
                ? parsedTracks.tracks
                : [];
        }

        if (isSelected) {
            tracksArray = tracksArray.filter(
                (track: { uri: string }) => track.uri !== trackUri
            );
        } else {
            tracksArray.push({ uri: trackUri });
        }

        const updatedTracks = {
            tracks: tracksArray,
            'snapshot_id:': snapshot_id,
        };
        sessionStorage.setItem(
            sessionStorageKey,
            JSON.stringify(updatedTracks)
        );

        setIsSelected(!isSelected);
        setBoxStyle(!isSelected ? styles.box__clicked : styles.box);
        console.log(sessionStorage.getItem(sessionStorageKey));
    };

    return <div className={boxStyle} onClick={handleClick}></div>;
}
