import { getTasks, updateTask } from 'api/task';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import { type Task, getConditionsFromTask } from 'models/frontend/Task/Task';

interface TaskModalProps {
  task: Task;
  refresh: () => Promise<void>;
}

const TaskModal = (props: TaskModalProps): React.JSX.Element => {
  const navigate = useNavigate();
  const navigateToCrossDesign = useCallback((): void => {
    // the crossDesign associated with the task is already a copy
    navigate('/editor', {
      state: { crossDesignId: props.task.crossDesignId },
    });
  }, [props.task.crossDesignId]);

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

  const updateDate = (isForward = true): void => {
    getTasks()
      .then(async (tasks) => {
        const task = tasks.find(
          (task) =>
            task.crossDesignId === props.task.crossDesignId && !task.completed
        );
        if (task === undefined) throw new Error('Task not found in database');
        task.dueDate = moment(task.dueDate)
          .add((isForward ? 1 : -1) * parseInt(sliderValue), 'days')
          .toISOString();
        await updateTask(task);
        await props.refresh();
        setIsChecked(false);
        toast.success('Successfully Updated tasks');
      })
      .catch(console.error);
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
          <h3 className='mb-4 mt-2 text-lg font-bold'>Update Due Date</h3>
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
          <div className='modal-action'>
            <button
              onClick={() => {
                updateDate(false);
              }}
              disabled={props.task.completed}
              className='btn-primary btn'
            >
              Earlier
            </button>
            <button
              onClick={() => {
                updateDate();
              }}
              disabled={props.task.completed}
              className='btn-primary btn'
            >
              Later
            </button>
            <button
              className='btn-secondary btn'
              onClick={navigateToCrossDesign}
            >
              View CrossDesign (Non-Editable)
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskModal;
