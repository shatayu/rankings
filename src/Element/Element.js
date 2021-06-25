import './Element.css';

export default function Element({rendered, other, onSelection}) {
    return <span
    className='element'
    value={rendered} onClick={() => onSelection(rendered, other)}>
        {String(rendered)}
    </span>
};