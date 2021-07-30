import styles from '../Input.module.css';

export default function GenericButton({icon, text, isEnabled, onClick}) {
    return (
        <div className={
            styles.buttonIconAndTextContainer + ' ' + (isEnabled ? 
                styles.enabledButtonIconAndTextContainer :
                styles.disabledButtonIconAndTextContainer
            )}
            onClick={() => {
                if (isEnabled) {
                    onClick();
                }
            }}
            >
            <div className={styles.buttonIconContainer + ' ' + (isEnabled ?  styles.enabledButton : styles.disabledButton)}>
                {icon}
            </div>
            <div className={styles.buttonText}>{text}</div>
        </div>
    )
}
