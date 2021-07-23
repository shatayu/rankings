import styles from './Input.module.css';

export default function Button({icon, isEnabled, onClick}) {
    return (
        <div className={styles.button + ' ' + (isEnabled ?  styles.enabledButton : styles.disabledButton)} onClick={onClick}>
            {icon}
        </div>
    )
}
