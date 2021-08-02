import styles from './Pair.module.css';

export default function Pair({a, b, onSelection, highlightedTerm}) {
    return (
        <div className={styles.pair}>
            <Element rendered={a} other={b} onSelection={onSelection} highlighted={a === highlightedTerm}/>
            <Element rendered={b} other={a} onSelection={onSelection} highlighted={b === highlightedTerm}/>
        </div>
    );

}

function Element({rendered, other, onSelection, highlighted}) {
    return <span
    className={styles.element + (highlighted ? ' ' + styles.highlightedElement : '')}
    value={rendered} onClick={() => onSelection(rendered, other)}>
        {String(rendered)}
    </span>
};