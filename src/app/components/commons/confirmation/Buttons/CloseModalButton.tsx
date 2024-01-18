import { faXmark } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
  onClose: VoidFunction;
}
export const CloseModalButton = ({ onClose }: Props) => {
  return (
    <button type='button' onClick={onClose}>
      <FontAwesomeIcon icon={faXmark} />
    </button>
  );
};
