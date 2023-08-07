import { type Strain } from 'models/frontend/Strain/Strain';

interface ScheduleTaskModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  strain: Strain;
}

const ScheduleTaskModal = (
  props: ScheduleTaskModalProps
): React.JSX.Element => {
  return <div></div>;
};

export default ScheduleTaskModal;
