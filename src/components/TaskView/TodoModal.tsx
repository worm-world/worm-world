import { Task } from 'models/frontend/Task/Task';

interface iTodoModalProps {
  task: Task;
}
const TodoModal = (props: iTodoModalProps): JSX.Element => {
  return (
    <>
      <input type='checkbox' id='conditions' className='modal-toggle' />
      <div className='modal'>
        <div className='modal-box relative'>
          <label
            htmlFor='conditions'
            className='btn-sm btn-circle btn absolute right-2 top-2'
          >
            ✕
          </label>
          Plate Temp: 40C
          <br></br>
          Drug Coating: Asprin
        </div>
      </div>
      <input type='checkbox' id='my-modal-3' className='modal-toggle' />
      <div className='modal'>
        <div className='modal-box relative h-32'>
          <label
            htmlFor='my-modal-3'
            className='btn-sm btn-circle btn absolute right-2 top-2'
          >
            ✕
          </label>
        </div>
      </div>
    </>
  );
};

export default TodoModal;
