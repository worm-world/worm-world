import StrainCard from 'components/StrainCard/StrainCard';
import { type Task, getConditionsFromTask } from 'models/frontend/Task/Task';
import TaskModal from 'components/TaskItem/TaskModal';
import {
  TbSnowflake as FreezeIcon,
  TbMicroscope as PCRIcon,
  TbArrowLoopLeft as SelfCrossIcon,
} from 'react-icons/tb';
import { BiX as CrossIcon } from 'react-icons/bi';
import { FaArrowRight as RightIcon } from 'react-icons/fa';
import { type Action } from 'models/db/task/Action';
import { Sex } from 'models/enums';

interface TaskItemProps {
  task: Task;
  updateTask: (task: Task) => void;
  refresh: () => Promise<void>;
}

const TaskItem = (props: TaskItemProps): React.JSX.Element => {
  const action = props.task.action;
  const shouldSwap =
    action === 'Cross' &&
    props.task.strain1.sex === Sex.Hermaphrodite &&
    props.task.strain2 !== undefined;
  const leftStrain = shouldSwap ? props.task.strain2 : props.task.strain1;
  const rightStrain = shouldSwap ? props.task.strain1 : props.task.strain2;
  const result = props.task.result;
  if (leftStrain !== undefined) leftStrain.probability = undefined;
  if (rightStrain !== undefined) rightStrain.probability = undefined;
  if (result !== undefined) result.probability = undefined;

  const conditionAmount = getConditionsFromTask(
    props.task.strain1,
    props.task.strain2
  ).size;
  return (
    <>
      <div className='flex h-40 items-center justify-items-start border-2 border-base-300 bg-base-200 shadow-md '>
        <div className='ml-4'>
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
        </div>
        <div className='mr-4 flex grow flex-row items-center justify-between py-8 pl-6 pr-3'>
          <div className='flex flex-row justify-center'>
            {leftStrain !== undefined && (
              <StrainCard data={leftStrain} id={''} />
            )}
            <div className='mx-4 flex flex-col justify-center'>
              <div className='indicator'>
                {conditionAmount > 0 && (
                  <span className='badge badge-info indicator-item w-4'>
                    {conditionAmount}
                  </span>
                )}
                <div
                  className={`h-16 w-16 rounded-full text-primary-content transition-colors ${getIconColor(
                    action
                  )}`}
                >
                  <div className='flex h-full items-center justify-center'>
                    {action === 'Cross' && <CrossIcon size='50' />}
                    {action === 'SelfCross' && <SelfCrossIcon size='35' />}
                    {action === 'Freeze' && <FreezeIcon size='35' />}
                    {action === 'Pcr' && <PCRIcon size='35' />}
                    <label
                      className='btn absolute w-16 opacity-0'
                      htmlFor={props.task.id}
                    />
                  </div>
                </div>
              </div>
            </div>
            {action === 'Cross' && rightStrain !== undefined && (
              <StrainCard data={rightStrain} id={''} />
            )}
            {action === 'SelfCross' && <div className='ml-4 w-60' />}
            <div className='my-auto p-2'>
              <RightIcon size='20' />
            </div>
            {result !== undefined && <StrainCard data={result} id={''} />}
          </div>
          <textarea
            className='textarea-accent textarea ml-16 h-32 w-32 justify-self-end'
            value={props.task.notes}
            onChange={(e) => {
              props.task.notes = e.target.value;
              props.updateTask(props.task);
            }}
          />
          <TaskModal task={props.task} refresh={props.refresh} />
        </div>
      </div>
    </>
  );
};

const getIconColor = (action: Action): string => {
  switch (action) {
    case 'Cross':
      return 'bg-primary hover:bg-primary-focus';
    case 'SelfCross':
      return 'bg-secondary hover:bg-secondary-focus';
    case 'Pcr':
      return 'bg-accent hover:bg-accent-focus';
    case 'Freeze':
      return 'bg-accent hover:bg-accent-focus';
  }
};

export default TaskItem;
