import CrossNode from 'components/CrossNode/CrossNode';
import { Task } from 'models/frontend/Task/Task';
import {
  TbSnowflake as FreezeIcon,
  TbMicroscope as PCRIcon,
  TbArrowLoopLeft as SelfCrossIcon,
} from 'react-icons/tb';
import { BiX as CrossIcon } from 'react-icons/bi';
import TodoModal from './TodoModal';
import moment from 'moment';

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
  const result = props.task.result;
  if (leftStrain !== undefined) leftStrain.probability = undefined;
  if (rightStrain !== undefined) rightStrain.probability = undefined;
  if (result !== undefined) result.probability = undefined;
  return (
    <>
      <div className='flex h-40 items-center justify-items-start border-2 border-base-300 bg-base-200 shadow-md'>
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
            {props.task.action === 'SelfCross' && <div className='ml-4 w-60' />}
            <div className='divider lg:divider-horizontal'>To</div>
            {result !== undefined && <CrossNode model={result} />}
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
          <TodoModal task={props.task} />
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

const getDateSections = (tasks: Task[]): Map<string, Set<Task>> => {
  const dates = new Map<string, Set<Task>>();
  tasks.forEach((task) => {
    if (task.dueDate !== undefined) {
      if (dates.has(task.dueDate.toLocaleDateString())) {
        dates.get(task.dueDate.toLocaleDateString())?.add(task);
      } else {
        dates.set(task.dueDate.toLocaleDateString(), new Set([task]));
      }
    }
  });
  return dates;
};

export const TaskView = (props: iTaskViewProps): JSX.Element => {
  const sections = Array.from(getDateSections(props.tasks)).sort(
    ([date1], [date2]) => (moment(date1).isAfter(moment(date2)) ? 1 : -1)
  );
  return (
    <div className='pt-4'>
      {sections.map(([date, section]) => (
        <div key={date}>
          <div className='collapse-arrow collapse'>
            <input type='checkbox' defaultChecked />
            <div className='collapse-title text-xl font-medium'>
              <div className='text-3xl'>
                <span>{date}</span>
                <span className=' mx-3 opacity-40'>|</span>
                <span>
                  {section.size} {section.size === 1 ? ' Task' : ' Tasks'}
                </span>
              </div>
            </div>
            <div className='collapse-content '>
              {Array.from(section).map((task, i) => (
                <div key={i} className='mb-2'>
                  <TaskItem
                    refresh={props.refresh}
                    task={task}
                    updateTask={props.updateTask}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className='divider' />
        </div>
      ))}
    </div>
  );
};
