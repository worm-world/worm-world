import { BiX as CloseIcon } from 'react-icons/bi';

export interface SelectedPillProps {
  removeFromSelected: () => void;
  displayVal: string;
}

const SelectedPill = (props: SelectedPillProps): JSX.Element => {
  return (
    <div className='badge-accent badge m-1 p-4 pr-0' key={props.displayVal}>
      <div className='mr-2'>{props.displayVal}</div>
      <button
        onClick={props.removeFromSelected}
        className='mr-0 h-8 w-8 rounded-full pr-0 align-middle hover:btn-primary'
      >
        <CloseIcon data-testid='closeButton' className='m-auto text-sm' />
      </button>
    </div>
  );
};

export const getSelectedPills = <U,>(
  selectedRecords: Set<U>,
  removeFromSelected: (value: U) => void,
  displayResultsOn: Array<keyof U>
): JSX.Element[] => {
  const pills = new Array<JSX.Element>();
  selectedRecords.forEach((record, index) => {
    const displayVal = displayResultsOn
      .map((field) => record[field] as string)
      .join(', ');
    pills.push(
      <SelectedPill
        key={`${record}-${index}`}
        removeFromSelected={() => removeFromSelected(record)}
        displayVal={displayVal}
      />
    );
  });

  return pills;
};

export default SelectedPill;
