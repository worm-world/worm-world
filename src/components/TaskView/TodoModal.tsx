import { getTasks, updateDbTask } from 'api/task';
import { Task } from 'models/frontend/Task/Task';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';

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
            ✕
          </label>
          Plate Temp: 40C
          <br></br>
          Drug Coating: Asprin
          <br></br>
          <br></br>
          <input
            type='range'
            min='1'
            max='5'
            onChange={handleSliderChange}
            className='range'
            step='1'
          />
          <div className='flex w-full justify-between px-2 text-xs'>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
          <button
            onClick={handleClick}
            disabled={props.task.completed}
            className='btn-primary btn mt-4 mb-4'
          >
            Postpone Task
          </button>
          <button className='btn-primary btn ml-8' onClick={navigateToTree}>
            View Non-Editable Origin Tree
          </button>
          <br></br>
          Warning: postponing this task may lead to unknown progeny
          <br></br>
        </div>
      </div>
      <input
        type='checkbox'
        id={`task-${props.task.id}`}
        className='modal-toggle'
      />
    </>
  );
};

export default TodoModal;
