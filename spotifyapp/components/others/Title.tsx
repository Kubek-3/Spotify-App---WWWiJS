import styles from "./title.module.scss"
export default function({children}:{children:React.ReactNode}) {
    return <h2 className={styles.title}>{children}</h2>
}

