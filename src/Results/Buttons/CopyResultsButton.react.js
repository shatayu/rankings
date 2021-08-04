import GenericButton from '../../Input/Buttons/GenericButton';
import toast from 'react-hot-toast';
import { useRecoilValue } from 'recoil';
import { ReactComponent as Copy } from '../../assets/copy.svg';
import { UserSortedRankingsAtom, TitleAtom } from '../../atoms';
import axios from 'axios';
import copy from 'copy-to-clipboard';
import { useToasterStore } from 'react-hot-toast';
import styles from '../../Input/Input.module.css';

export default function CopyResultsButton() {
    const userSortedRankings = useRecoilValue(UserSortedRankingsAtom);
    const title = useRecoilValue(TitleAtom);
    
    const rankingsString = userSortedRankings.length > 0 ? userSortedRankings
        .map((value, index) => String(index + 1) + '. ' + value)
        .reduce((accumulator, current, index) => accumulator + '\n' + current) : '';
    const {toasts} = useToasterStore();
    return (
        <GenericButton
            icon={<Copy className={styles.buttonIcon} />}
            text='COPY RESULTS'
            isEnabled={toasts.length === 0}
            onClick={async () => {
                // send URL up to DB
                const url = 'https://3ocshrauf1.execute-api.us-west-1.amazonaws.com/lists';
        
                const body = {
                    question: '',
                    list: userSortedRankings
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
                const baseURL = window.location.host;
                copy(title + ':\n\n' + rankingsString + '\n\nLink: https://' + baseURL + '/' + result.data.new_id + '/');
            }}
            isDeleteButton={false}
        />
    );
}