import { getTasks, updateDbTask } from 'api/task';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import { Task, getConditionsFromTask } from 'models/frontend/Task/Task';

interface iTodoModalProps {
  task: Task;
  refresh: () => Promise<void>;
}

const TodoModal = (props: iTodoModalProps): JSX.Element => {
  const navigate = useNavigate();
  const navigateToTree = useCallback((): void => {
    // the tree associated with the task is already a copy
    navigate('/tree-view', {
      state: { treeId: props.task.treeId },
    });
  }, [props.task.treeId]);

  const [sliderValue, setSliderValue] = useState('3');
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (): void => {
    setIsChecked(!isChecked);
    void props.refresh();
  };

  const handleSliderChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSliderValue(event.target.value);
  };

  const handleClick = (): void => {
    void postponeDates();
  };

  const postponeDates = async (): Promise<void> => {
    const allTasks = await getTasks();
    for (const t of allTasks) {
      if (t.tree_id === props.task.treeId && !t.completed) {
        t.due_date = moment(t.due_date).add(sliderValue, 'days').toISOString();
        await updateDbTask(t);
      }
    }
    toast.success('Successfully Updated tasks');
    void props.refresh();
    setIsChecked(false);
  };
  const taskCondtions = Array.from(
    getConditionsFromTask(props.task.strain1, props.task.strain2)
  );

  return (
    <>
      <input
        type='checkbox'
        checked={isChecked}
        onChange={handleCheckboxChange}
        id={props.task.id}
        className='modal-toggle'
      />
      <div className='modal fixed'>
        <div className='modal-box relative '>
          <label
            htmlFor={props.task.id}
            className='btn-sm btn-circle btn absolute right-2 top-2'
          >
            x
          </label>
          {taskCondtions.length > 0 && (
            <>
              <h3 className='text-lg font-bold'>Conditions</h3>
              <div className='mt-4 overflow-x-auto'>
                <table className='table w-full'>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  {taskCondtions.map((condition) => {
                    return (
                      <tr key={condition[1].name}>
                        <td>{condition[1].name}</td>
                        <td>{condition[1].description}</td>
                      </tr>
                    );
                  })}
                </table>
              </div>
            </>
          )}
          <h3 className='mb-4 mt-2 text-lg font-bold'>Update Due-Date:</h3>
          <input
            type='range'
            min='1'
            max='5'
            onChange={handleSliderChange}
            className='range'
            step='1'
          />

          <div className='mb-4 flex w-full justify-between px-2 text-xs'>
            <span>1 Day</span>
            <span>2 Days</span>
            <span>3 Days</span>
            <span>4 Days</span>
            <span>5 Days</span>
          </div>
          <button
            onClick={handleClick}
            disabled={props.task.completed}
            className='btn-primary btn mb-4 mt-4'
          >
            Postpone Task
          </button>
          <button className='btn-primary btn ml-8' onClick={navigateToTree}>
            View Non-Editable Origin Tree
          </button>
        </div>
      </div>
    </>
  );
};

export default TodoModal;
