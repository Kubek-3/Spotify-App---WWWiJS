import styles from "./wrapper.module.scss"

export default function Wrapper({children} : {children: React.ReactNode}) {
    return (
        <div className={styles.wrapper}>{children}</div>
    )
}