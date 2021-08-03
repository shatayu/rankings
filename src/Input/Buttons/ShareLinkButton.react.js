import GenericButton from './GenericButton';
import toast from 'react-hot-toast';
import { useRecoilValue } from 'recoil';
import { ReactComponent as Share } from '../../assets/link.svg';
import { EntriesListAtom } from '../../atoms';
import axios from 'axios';
import copy from 'copy-to-clipboard';
import { useToasterStore } from 'react-hot-toast';
import styles from '../Input.module.css';

export default function ShareLinkButton() {
    const entriesList = useRecoilValue(EntriesListAtom);
    const {toasts} = useToasterStore();
    return (
        <GenericButton
            icon={<Share className={styles.buttonIcon} />}
            text='COPY LINK'
            isEnabled={entriesList.length > 1 && toasts.length === 0}
            onClick={async () => {
                // send URL up to DB
                const url = 'https://3ocshrauf1.execute-api.us-west-1.amazonaws.com/lists';
        
                const body = {
                    question: '',
                    list: entriesList
                };

                const successComponent = (
                    <span className={styles.toastSuccessComponentContainer} onClick={() => toast.dismiss()}>
                        Copied to clipboard
                    </span>
                );
                
                const promise = axios.put(url, body);
                toast.promise(promise, {
                    loading: 'Making link...',
                    success: successComponent,
                    error: 'There was an error making your link'
                });

                const result = await promise;
                const baseURL = window.location.href.substr(0, window.location.href.lastIndexOf('/')) + '/';
                copy(baseURL + result.data.new_id);
            }}
            isDeleteButton={false}
        />
    );
}