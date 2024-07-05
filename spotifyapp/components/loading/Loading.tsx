import styles from "./loading.module.scss"
export default function Loading() {
	return (
		<div className={styles.box}>
			<div>
				<span className={styles.box__loading}></span>
			</div>
		</div>
	)
}
