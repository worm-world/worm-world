import { BiX as CloseIcon } from 'react-icons/bi';

export interface XNodeProps {
  id: string;
}

export const XNode = (props: XNodeProps): JSX.Element => {
  return (
    <label key={props.id} htmlFor={`cross-filter-modal-${props.id}`}>
      <div className='h-16 w-16 rounded-full bg-primary p-4 shadow transition hover:cursor-pointer hover:bg-primary-focus'>
        <CloseIcon className='h-8 w-8 text-3xl text-primary-content' />
      </div>
    </label>
  );
};
