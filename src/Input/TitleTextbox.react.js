import { useRecoilState, useRecoilValue } from "recoil"
import { TitleAtom, SharedLinkAtom } from "../atoms"
import styles from './Input.module.css';
import { getDefaultTitle } from "../utils/inputUtils";
import TextareaAutosize from 'react-textarea-autosize';
import { isSharedLink } from '../utils/APIUtils';
import { useEffect, useState } from 'react';

export default function TitleTextbox({localTierList}) {
    const [title, setTitle] = useRecoilState(TitleAtom);

    const defaultTitle = getDefaultTitle(localTierList);
    const [placeholder, setPlaceholder] = useState(defaultTitle);

    const sharedLinkInfo = useRecoilValue(SharedLinkAtom);
    // if user came from shared link then fill in list
    useEffect(() => {
        if ((isSharedLink() && localTierList.length === 1 && localTierList[0].length === 0 && !sharedLinkInfo.hasLoaded)) {
            setPlaceholder('Loading...');
        } else if (
            sharedLinkInfo.hasLoaded && (
                (localTierList.length === 1 && localTierList[0].length === 0) ||
                (title.length === 0)
            )
        ) {
            setPlaceholder(defaultTitle);
        }
    }, [defaultTitle, localTierList, sharedLinkInfo.hasLoaded, title.length]);
    
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