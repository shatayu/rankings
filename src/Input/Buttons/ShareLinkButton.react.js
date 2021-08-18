import GenericButton from './GenericButton';
import toast from 'react-hot-toast';
import { useRecoilValue } from 'recoil';
import { ReactComponent as Share } from '../../assets/link.svg';
import { ReactComponent as Copy } from '../../assets/copy.svg';
import { TitleAtom } from '../../atoms';
import axios from 'axios';
import { useToasterStore } from 'react-hot-toast';
import styles from '../Input.module.css';
import { confirmAlert } from 'react-confirm-alert';
import '../Alert.css';
import { useState, useRef } from 'react';
import { useEffect } from 'react';

export default function ShareLinkButton({localTierList}) {
    const title = useRecoilValue(TitleAtom);
    const {toasts} = useToasterStore();

    const entriesList = localTierList.slice().flat();

    const submit = () => {
        confirmAlert({
          title: '',
          customUI: ({ onClose }) => <CopyLinkAlert onClose={onClose} />,
          message: 'Are you sure to do this.',
          buttons: [
            {
              label: 'Yes',
              onClick: () => alert('Click Yes')
            },
            {
              label: 'No',
              onClick: () => alert('Click No')
            }
          ]
        });
      };

    return (
        <GenericButton
            icon={<Share className={styles.buttonIcon} />}
            text='COPY LINK'
            isEnabled={entriesList.length > 1 && toasts.length === 0}
            onClick={async () => {
                submit();
                // send URL up to DB
                // const url = 'https://3ocshrauf1.execute-api.us-west-1.amazonaws.com/lists';
        
                // const body = {
                //     title,
                //     list: entriesList
                // };

                // const successComponent = (
                //     <span className={styles.toastSuccessComponentContainer} onClick={() => toast.dismiss()}>
                //         Copied to clipboard
                //     </span>
                // );
                
                // const promise = axios.put(url, body);
                // toast.promise(promise, {
                //     loading: 'Making link...',
                //     success: successComponent,
                //     error: 'There was an error making your link'
                // });

                // const result = await promise;
                // const baseURL = window.location.host;
                // copy(`${baseURL.includes('localhost') ? '' : 'https://'}` + baseURL + '/' + result.data.new_id + '/');
            }}
            isDeleteButton={false}
        />
    );
}

function CopyLinkAlert({onClose, title, entriesList}) {
    const loadingValue = 'Loading...';
    const [shareURL, setShareURL] = useState('beans');

    // generate link on startup
    useEffect(() => {
        async function genLink() {
            const AWS_URL = 'https://3ocshrauf1.execute-api.us-west-1.amazonaws.com/lists';

            const body = {
                title,
                list: entriesList
            };
    
            // const result = await axios.put(AWS_URL, body);
            // const baseURL = window.location.host;
            // const newShareURL = `${baseURL.includes('localhost') || baseURL.includes('.') ? '' : 'https://'}` +
            //     baseURL + '/' + result.data.new_id + '/';
            // setShareURL(newShareURL);
        }
        
        genLink();
    }, [entriesList, title]);

    const textAreaRef = useRef(null);
  
    function copyToClipboard(e) {
        textAreaRef.current.select();
        document.execCommand('copy');
        document.body.focus();
    };

    const isLoading = shareURL === loadingValue;

    return (
        <div className={styles.copyLinkContainer}>
            <div className={styles.copyLinkHeader}>Copy Link</div>
            <div className={styles.copyLinkTextAndBarContainer}>
                <form>
                    <textarea
                    ref={textAreaRef}
                    cols={32}
                    value={shareURL}
                    className={styles.copyLinkBar + ' ' +
                        (isLoading ? styles.loadingCopyLinkBar : '')}
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