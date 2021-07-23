import styles from './Input.module.css';
import { ReactComponent as Trash } from '../assets/trash.svg'

export default function Button({icon, isEnabled, onClick}) {
    return (
        <div className={styles.button + ' ' + (isEnabled ?  styles.enabledButton : styles.disabledButton)} onClick={onClick}>
            {<Trash />}
        </div>
    )
}
