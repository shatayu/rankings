import GenericButton from './GenericButton';
import { useRecoilValue } from 'recoil';
import { ReactComponent as Share } from '../../assets/link.svg';
import { TitleAtom } from '../../atoms';
import { useToasterStore } from 'react-hot-toast';
import styles from '../Input.module.css';
import { confirmAlert } from 'react-confirm-alert';
import '../Alert.css';
import CopyLinkAlert from '../../Alert/CopyLinkAlert.react';

export default function ShareLinkButton({localTierList}) {
    const title = useRecoilValue(TitleAtom);
    const {toasts} = useToasterStore();

    const entriesList = localTierList.slice().flat();

    const submit = () => {
        confirmAlert({
          customUI: ({ onClose }) => <CopyLinkAlert {...{onClose, title, entriesList}}/>,
        });
      };

    return (
        <GenericButton
            icon={<Share className={styles.buttonIcon} />}
            text='COPY LINK'
            isEnabled={entriesList.length > 1 && toasts.length === 0}
            onClick={async () => {
                submit();
            }}
            isDeleteButton={false}
        />
    );
}