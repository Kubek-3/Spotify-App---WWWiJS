import { useEffect, useState } from 'react';
import styles from './checkbox.module.scss';

interface CheckBoxSavedTracks {
    trackId: string;
}

export default function CheckBox({ trackId }: CheckBoxSavedTracks) {
    let trackId_ = trackId.replace('spotify:track:', '');
    const sessionStorageKey = 'selectedSavedTracks';
    const [isSelected, setIsSelected] = useState(false);
    const [boxStyle, setBoxStyle] = useState(styles.box);

    useEffect(() => {
        const storedTracks = sessionStorage.getItem(sessionStorageKey);
        if (storedTracks) {
            const tracksArray = JSON.parse(storedTracks);
            const isTrackSelected = tracksArray.includes(trackId_);
            setIsSelected(isTrackSelected);
            setBoxStyle(isTrackSelected ? styles.box__clicked : styles.box);
        } else {
            setIsSelected(false);
            setBoxStyle(styles.box);
        }
    }, [trackId_, sessionStorageKey]);

    const handleClick = () => {
        const storedTracks = sessionStorage.getItem(sessionStorageKey);
        let tracksArray = [];

        if (storedTracks) {
            tracksArray = JSON.parse(storedTracks);
        }

        if (isSelected) {
            tracksArray = tracksArray.filter((id: string) => id !== trackId_);
        } else {
            tracksArray.push(trackId_);
        }

        sessionStorage.setItem(sessionStorageKey, JSON.stringify(tracksArray));

        setIsSelected(!isSelected);
        setBoxStyle(!isSelected ? styles.box__clicked : styles.box);
        console.log(sessionStorage.getItem(sessionStorageKey));
    };

    return <div className={boxStyle} onClick={handleClick}></div>;
}
