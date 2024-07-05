import { useEffect } from "react";
import styles from "./popup.module.scss";

interface PopupProps {
    message: string;
    duration: number;
    onClose: () => void;
}

const Popup = ({ message, duration, onClose }: PopupProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className={styles.popup}>
            <p>{message}</p>
        </div>
    );
};

export default Popup;
