import { useRecoilState, useRecoilValue } from "recoil"
import { TitleAtom, SharedLinkAtom, TierListAtom } from "../atoms"
import styles from './Input.module.css';
import { useGetDefaultTitle } from "../utils/inputUtils";
import TextareaAutosize from 'react-textarea-autosize';
import { isSharedLink } from '../utils/APIUtils';
import { useEffect, useState } from 'react';

export default function TitleTextbox() {
    const [title, setTitle] = useRecoilState(TitleAtom);

    const defaultTitle = useGetDefaultTitle();
    const [placeholder, setPlaceholder] = useState(defaultTitle);
    const tierList = useRecoilValue(TierListAtom);

    const sharedLinkInfo = useRecoilValue(SharedLinkAtom);
    // if user came from shared link then fill in list
    useEffect(() => {
        if (isSharedLink() && tierList.length === 1 && tierList[0].length === 0 && !sharedLinkInfo.hasLoaded) {
            setPlaceholder('Loading...');
        } else {
            setPlaceholder(defaultTitle);
        }
    }, [defaultTitle, sharedLinkInfo.hasLoaded, tierList]);
    
    // clear title
    if (title === defaultTitle) {
        setTitle('');
    }
    
    return (
        <TextareaAutosize
            type="text"
            value={title}
            className={styles.title}
            placeholder={placeholder}
            onChange={(event) => {
                setTitle(event.target.value);
            }}
            minRows={1}
        />
    );
}