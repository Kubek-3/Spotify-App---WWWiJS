import styles from "./box.module.scss"
export default function Box({ children }: { children: React.ReactNode }) {
	return <div className={styles.box}>{children}</div>
}
