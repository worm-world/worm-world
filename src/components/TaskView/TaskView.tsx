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
  refresh: () => Promise<void>;
}

const TaskItem = (props: iTaskProps): JSX.Element => {
  const shouldSwap =
    props.task.action === 'Cross' &&
    props.task.strain1.sex === 2 &&
    props.task.strain2 !== undefined;
  const leftStrain = shouldSwap ? props.task.strain2 : props.task.strain1;
  const rightStrain = shouldSwap ? props.task.strain1 : props.task.strain2;
  return (
    <>
      <div className='flex h-40 items-center justify-items-start border-2 border-base-300 bg-base-200 shadow-md'>
        <div className='h-full w-60 bg-base-100 pr-7 pt-4 pl-4'>
          <div className='flex h-40  flex-col justify-around'>
            <div className='flex flex-row'>
              <input
                type='checkbox'
                className='checkbox-accent checkbox checkbox-lg'
                checked={props.task.completed}
                readOnly
                onClick={(e) => {
                  props.task.completed = e.currentTarget.checked;
                  props.updateTask(props.task);
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
            {leftStrain !== undefined && <CrossNode model={leftStrain} />}
            <div className='h-full pb-4'>
              <div className='m-8 mx-6 mb-2 h-16 w-16 rounded-full border-2 border-neutral bg-accent text-accent-content'>
                <div className='flex h-full items-center justify-center'>
                  {props.task.action === 'Cross' && (
                    <CrossIcon size='50' className='stroke-neutral'></CrossIcon>
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
            {props.task.action === 'Cross' && rightStrain !== undefined && (
              <CrossNode model={rightStrain} />
            )}
          </div>
          <textarea
            // value={props.task.notes ?? ""}
            className='textarea-accent textarea ml-16 h-32 w-32 justify-self-end'
            value={props.task.notes}
            onChange={(e) => {
              props.task.notes = e.target.value;
              props.updateTask(props.task);
            }}
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
  refresh: () => Promise<void>;
}

export const TaskView = (props: iTaskViewProps): JSX.Element => {
  return (
    <div className='pt-4'>
      {props.tasks.map((task, i) => (
        <div key={i}>
          <TaskItem
            refresh={props.refresh}
            task={task}
            updateTask={props.updateTask}
          />
          <div className='divider' />
        </div>
      ))}
    </div>
  );
};
