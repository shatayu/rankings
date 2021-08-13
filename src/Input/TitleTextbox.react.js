import { useRecoilState } from "recoil"
import { TitleAtom } from "../atoms"
import styles from './Input.module.css';
import { useGetDefaultTitle } from "../utils/inputUtils";
import TextareaAutosize from 'react-textarea-autosize';

export default function TitleTextbox() {
    const [title, setTitle] = useRecoilState(TitleAtom);
    const defaultTitle = useGetDefaultTitle();
    
    // clear title
    if (title === defaultTitle) {
        setTitle('');
    }
    
    return (
        <TextareaAutosize
            type="text"
            value={title}
            className={styles.title}
            placeholder={defaultTitle}
            onChange={(event) => {
                setTitle(event.target.value);
            }}
            minRows={1}
        />
    );
}