import GenericButton from './GenericButton';
import { useRecoilValue } from 'recoil';
import { ReactComponent as Share } from '../../assets/share.svg';
import { TitleAtom, UserSortedRankingsAtom } from '../../atoms';
import { useToasterStore } from 'react-hot-toast';
import styles from '../Input.module.css';
import { confirmAlert } from 'react-confirm-alert';
import '../Alert.css';
import CopyLinkAlert from '../../Alert/CopyLinkAlert.react';
import { ResponsesGraphAtom, UserQuestionsAskedAtom, PageNumberAtom } from '../../atoms';

export default function ShareLinkButton({tierList}) {
    const title = useRecoilValue(TitleAtom);
    const sortedRankings = useRecoilValue(UserSortedRankingsAtom);
    const {toasts} = useToasterStore();

    const responsesGraph = useRecoilValue(ResponsesGraphAtom);
    const userQuestionsAsked = useRecoilValue(UserQuestionsAskedAtom);
    const userSortedRankings = useRecoilValue(UserSortedRankingsAtom);
    const pageNumber = useRecoilValue(PageNumberAtom);

    const entriesList = tierList.slice().flat();

    const submit = () => {
        confirmAlert({
          customUI: ({ onClose }) => <CopyLinkAlert {...{
              onClose,
              title,
              entriesList,
              sortedRankings,
              tierList,
              responsesGraph,
              userQuestionsAsked,
              userSortedRankings,
              pageNumber
            }
            }/>,
        });
      };

    return (
        <GenericButton
            icon={<Share className={styles.buttonIcon} />}
            text={`SHARE ${sortedRankings.length === 0 ? 'LIST' : 'RESULTS'}`}
            isEnabled={entriesList.length > 1 && toasts.length === 0}
            onClick={async () => {
                submit();
            }}
            isDeleteButton={false}
        />
    );
}