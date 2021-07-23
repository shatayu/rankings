import Button from './Button';
import { useRecoilValue } from 'recoil';
import { ReactComponent as Share } from '../assets/link.svg';
import { EntryState } from '../atoms';
import axios from 'axios';
import copy from 'copy-to-clipboard';

export default function ShareLinkButton() {
    const entriesList = useRecoilValue(EntryState('entriesList'));
    return (
        <Button
            icon={<Share />}
            isEnabled={entriesList.length > 1}
            onClick={async () => {
                // send URL up to DB
                const url = 'https://3ocshrauf1.execute-api.us-west-1.amazonaws.com/lists';
        
                const body = {
                    question: '',
                    list: entriesList
                };

                const result = await axios.put(url, body);

                const baseURL = window.location.href.substr(0, window.location.href.lastIndexOf('/')) + '/';
                copy(baseURL + result.data.new_id);

                // add UI
            }}
        />
    );
}