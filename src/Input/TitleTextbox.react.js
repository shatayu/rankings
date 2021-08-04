import { useRecoilState } from "recoil"
import { TitleAtom } from "../atoms"
import styles from './Input.module.css';
import { useGetDefaultTitle } from "../utils/inputUtils";

export default function TitleTextbox() {
    const [title, setTitle] = useRecoilState(TitleAtom);
    const defaultTitle = useGetDefaultTitle();
    
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