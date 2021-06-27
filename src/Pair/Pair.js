import styles from './Pair.module.css';

export default function Pair({a, b, onSelection}) {
    const willFlip = Math.random() < 0.5;
    const left = willFlip ? a : b;
    const right = willFlip ? b : a;
    return (
        <div className={styles.pair}>
            <Element rendered={left} other={right} onSelection={onSelection} />
            <Element rendered={right} other={left} onSelection={onSelection} />
        </div>
    );

}

function Element({rendered, other, onSelection}) {
    return <span
    className={styles.element}
    value={rendered} onClick={() => onSelection(rendered, other)}>
        {String(rendered)}
    </span>
};