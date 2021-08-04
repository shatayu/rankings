import { useRecoilState, useRecoilValue } from "recoil"
import { EntriesListAtom, TitleAtom } from "../atoms"
import styles from './Input.module.css';

export default function TitleTextbox() {
    const [title, setTitle] = useRecoilState(TitleAtom);
    const entriesList = useRecoilValue(EntriesListAtom);
    const defaultTitle = `My Top ${entriesList.length}`;
    
    return (
        <input
            type="text"
            value={title}
            className={styles.title}
            placeholder={defaultTitle}
            onChange={(event) => {
                if (event.target.value.length > 0) {
                    setTitle(event.target.value);
                }
            }}
        />
    );
}