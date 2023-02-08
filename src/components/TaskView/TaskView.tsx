import CrossNode from 'components/CrossNode/CrossNode';
import { Task } from 'models/frontend/Task/Task';
import {
  TbSnowflake as FreezeIcon,
  TbMicroscope as PCRIcon,
  TbArrowLoopLeft as SelfCrossIcon,
} from 'react-icons/tb';
import { BiX as CrossIcon } from 'react-icons/bi';
import TodoModal from './TodoModal';

interface iTaskProps {
  task: Task;
  updateTask: (task: Task) => void;
}

const TaskItem = (props: iTaskProps): JSX.Element => {
  return (
    <>
      <div className='flex h-40 items-center justify-items-start border-2 border-base-300 bg-base-200 shadow-md'>
        <div className='w-min-content h-full bg-base-100 pr-7 pl-7'>
          <div className='flex h-40 flex-col justify-around'>
            <div className='flex flex-row'>
              <input
                type='checkbox'
                className='checkbox-accent checkbox checkbox-lg'
                checked={props.task.completed}
                readOnly
                onClick={(e) => {
                  const newTask = new Task(props.task.generateRecord());
                  newTask.completed = e.currentTarget.checked;
                  props.updateTask(newTask);
                }}
              />
              <p className='top-0 pl-4 pb-4 text-3xl'>
                {props.task.dueDate?.toLocaleDateString() ?? 'No Due Date'}
              </p>
            </div>
            <div className=' bottom-0 mb-4 ml-0'>
              <button className='btn-primary btn w-full'>
                <label htmlFor='my-modal-3'>Postpone</label>
              </button>
            </div>
          </div>
        </div>
        <div className='mr-4 flex grow flex-row items-center justify-between py-8 pl-6 pr-3'>
          <div className='flex flex-row justify-center'>
            <CrossNode model={props.task.strain1} />
            <div className='h-full pb-4'>
              <div className='m-8 mx-6 mb-2 h-16 w-16 rounded-full border-2 border-neutral bg-accent text-accent-content'>
                <div className='flex h-full items-center justify-center'>
                  {props.task.action === 'Cross' && (
                    <CrossIcon size='35' className='stroke-neutral'></CrossIcon>
                  )}
                  {props.task.action === 'SelfCross' && (
                    <SelfCrossIcon
                      size='35'
                      className='stroke-neutral'
                    ></SelfCrossIcon>
                  )}
                  {props.task.action === 'Freeze' && (
                    <FreezeIcon
                      size='35'
                      className='stroke-neutral'
                    ></FreezeIcon>
                  )}
                  {props.task.action === 'Pcr' && (
                    <PCRIcon size='35' className='stroke-neutral'></PCRIcon>
                  )}
                  <label
                    className='btn absolute z-0 w-16 opacity-0'
                    htmlFor='conditions'
                  ></label>
                </div>
              </div>
            </div>
            {props.task.action === 'Cross' &&
              props.task.strain2 !== undefined && (
                <CrossNode model={props.task.strain2} />
              )}
          </div>
          <textarea
            // value={props.task.notes ?? ""}
            className='textarea-accent textarea ml-16 h-32 w-32 justify-self-end'
            placeholder='Notes'
          ></textarea>
          <TodoModal />
        </div>
      </div>
    </>
  );
};

interface iTaskViewProps {
  tasks: Task[];
  updateTask: (task: Task) => void;
}

export const TaskView = (props: iTaskViewProps): JSX.Element => {
  return (
    <div className='pt-4'>
      {props.tasks.map((task, i) => (
        <div key={i}>
          <TaskItem task={task} updateTask={props.updateTask} />
          <div className='divider' />
        </div>
      ))}
    </div>
  );
};