import { Task } from 'models/frontend/Task/Task';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface iTodoModalProps {
  task: Task;
}
const TodoModal = (props: iTodoModalProps): JSX.Element => {
  const navigate = useNavigate();
  const navigateToTree = useCallback((): void => {
    // the tree associated with the task is already a copy
    navigate('/tree-view', {
      state: { treeId: props.task.treeId },
    });
  }, [props.task.treeId]);

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
          <br></br>
          <button className='btn-primary btn mt-8' onClick={navigateToTree}>
            View Non-Editable Origin Tree
          </button>
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
