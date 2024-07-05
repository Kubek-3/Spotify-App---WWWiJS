import styles from './burgerbtn.module.scss'

interface BurgerBtnProps {
    open: boolean;
    isOpen: (state: boolean) => void;
}

export default function BurgerBtn({ open, isOpen }:BurgerBtnProps) {
	return (
		<button className={styles.burgerBtn} onClick={()=>isOpen(!open)}>
			<div className={styles.burgerBtn__box}>
				<div className={styles.burgerBtn__bars}></div>
			</div>
		</button>
	)
}
