import StrainNode from 'components/StrainNode/StrainNode';
import { type Task, getConditionsFromTask } from 'models/frontend/Task/Task';
import {
  TbSnowflake as FreezeIcon,
  TbMicroscope as PCRIcon,
  TbArrowLoopLeft as SelfCrossIcon,
} from 'react-icons/tb';
import { BiX as CrossIcon } from 'react-icons/bi';
import TodoModal from 'components/TaskView/TodoModal';
import moment from 'moment';
import { type Action } from 'models/db/task/Action';

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

interface TaskItemProps {
  task: Task;
  updateTask: (task: Task) => void;
  refresh: () => Promise<void>;
}

const TaskItem = (props: TaskItemProps): JSX.Element => {
  const action = props.task.action;
  const shouldSwap =
    action === 'Cross' &&
    props.task.strain1.sex === 2 &&
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
            {leftStrain !== undefined && <StrainNode model={leftStrain} />}
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
                      className='btn absolute z-0 w-16 opacity-0'
                      htmlFor={props.task.id}
                    ></label>
                  </div>
                </div>
              </div>
            </div>
            {action === 'Cross' && rightStrain !== undefined && (
              <StrainNode model={rightStrain} />
            )}
            {action === 'SelfCross' && <div className='ml-4 w-60' />}
            <div className='divider lg:divider-horizontal'>To</div>
            {result !== undefined && <StrainNode model={result} />}
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
          <TodoModal task={props.task} refresh={props.refresh} />
        </div>
      </div>
    </>
  );
};

interface TaskViewProps {
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

export const TaskView = (props: TaskViewProps): JSX.Element => {
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
