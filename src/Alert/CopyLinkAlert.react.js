import { useState, useEffect, useRef } from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import axios from 'axios';
import styles from './CopyLinkAlert.module.css';
import toast from 'react-hot-toast';
import { ReactComponent as Copy } from '../assets/copy.svg';
import { getDefaultTitle } from '../utils/inputUtils';

export default function CopyLinkAlert({onClose, title, entriesList, sortedRankings}) {
    const loadingValue = 'Loading...';
    const [shareURL, setShareURL] = useState(loadingValue);

    const successComponent = (
        <span className={styles.toastSuccessComponentContainer} onClick={() => toast.dismiss()}>
            Copied to clipboard
        </span>
    );

    // generate link on startup
    useEffect(() => {
        async function genLink() {
            const AWS_URL = 'https://3ocshrauf1.execute-api.us-west-1.amazonaws.com/lists';

            const body = {
                title,
                list: entriesList
            };
    
            const result = await axios.put(AWS_URL, body);
            const baseURL = window.location.host;
            const newShareURL = `${baseURL.includes('localhost') || baseURL.includes('.') ? '' : 'https://'}` +
                baseURL + '/' + result.data.new_id + '/';
            setShareURL(newShareURL);
        }
        
        genLink();
    }, [entriesList, title]);

    const textAreaRef = useRef(null);
  
    function copyToClipboard(e) {
        textAreaRef.current.select();
        document.execCommand('copy');
        window.getSelection().removeAllRanges()
        toast(successComponent);
    };

    const isLoading = shareURL === loadingValue;
    const isResults = sortedRankings.length > 0;

    return (
        <div className={styles.copyLinkContainer}>
            <div className={styles.copyLinkHeader}>Copy {isResults ? 'Results' : 'Link'}</div>
            <div className={styles.copyLinkTextAndBarContainer}>
                <form>
                    <TextareaAutosize
                    ref={textAreaRef}
                    cols={32}
                    value={generateCopyText(title, entriesList, sortedRankings, shareURL)}
                    className={styles.copyLinkBar + ' ' +
                        (isLoading ? styles.loadingCopyLinkBar : '') + ' ' +
                        (isResults ? styles.copyLinkBarResults : styles.copyLinkBarInput)
                    }
                    readOnly={true}
                    />
                </form>
                {
                    // only give copy option if it's supported
                    document.queryCommandSupported('copy') &&
                    <div>
                        <div className={styles.copyLinkButton + ' ' + (isLoading ?
                            styles.disabledCopyLinkButton :
                            styles.enabledCopyLinkButton
                        )} onClick={copyToClipboard}>
                            <Copy />
                        </div> 
                    </div>
                }
            </div>
        </div>
    )
}

function generateCopyText(title, entriesList, sortedRankings, link) {
    const displayTitle = title.length > 0 ? title : getDefaultTitle([entriesList]);
    if (sortedRankings.length === 0) {
        return link;
    } else {
        return (
            sortedRankings.reduce(
                (accumulator, currentValue, currentIndex) => accumulator + `${currentIndex + 1}. ${currentValue}\n`,
                `${displayTitle}:\n\n`
            ) + `\nRank this list at ${link}`
        );
    }
}