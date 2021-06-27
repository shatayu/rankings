import { useState } from 'react';
import styles from './Input.module.css';

export default function Input({onFinalizeEntries}) {
    const [value, setValue] = useState('');
    const [entries, setEntries] = useState([]);

    const onSubmit = (e, value) => {
        e.preventDefault();
        console.log('submitted');
        console.log(value);

        setEntries([...entries, value]);
        setValue('');
    }

    return (
        <div className={styles.container}>
            <div className={styles.textboxContainer}>
                <form onSubmit={e => onSubmit(e, value)}>
                    <label>
                    <input
                        type="text"
                        value={value}
                        className={styles.textbox}
                        onChange={(event) => {
                            setValue(event.target.value)
                        }}

                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                            console.log('enter');
                            }
                        }}
                    />
                    </label>
                </form>
            </div>
            <div className={styles.submitButtonContainer}>
                <div className={styles.submitButton} onClick={() => onFinalizeEntries(entries)}>Start Ranking</div>
            </div>
            <div className={styles.entryContainer}>
                {entries.map((value, i) => <InputElement key={i} value={value} onRemove={() => {}} />)}
            </div>
        </div>
    );
}

function InputElement({value, onRemove}) {
    return (
        <div className={styles.entry} onClick={onRemove}>
            {value}
        </div>
    );

}