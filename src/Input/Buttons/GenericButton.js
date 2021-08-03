import styles from '../Input.module.css';

export default function GenericButton({icon, text, isEnabled, onClick, isDeleteButton}) {
    const enabledIconAndTextContainerClass = isDeleteButton ? styles.enabledDeleteButtonIconAndTextContainer :
        styles.enabledButtonIconAndTextContainer;

    return (
        <div className={
            `${styles.buttonIconAndTextContainer} ${isEnabled ? enabledIconAndTextContainerClass :
                styles.disabledButtonIconAndTextContainer}`
            }
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
