import { useEffect, useState } from "react"
import styles from "./popup.module.scss"
export default function Popup({currPopup, popupText}:{currPopup:number, popupText:string}) {
    const [display, setDisplay] = useState<boolean>(currPopup? true:false);
    useEffect(() => {
      if (currPopup) {
        setDisplay(true);
      } else {
        const timer = setTimeout(() => setDisplay(false), 500);
        return () => clearTimeout(timer);
      }
    }, [currPopup]);
    return ( display &&
        <div className={styles.box}
            style={{
                opacity: currPopup,
                transform: `translate(0, ${currPopup * 60}px)`}}>
            <p className={styles.box__text}>{popupText}</p>
        </div>
    )
}