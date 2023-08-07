import { Task } from 'models/frontend/Task/Task';
import moment from 'moment';
import TaskItem, { TaskStatement } from 'components/TaskItem/TaskItem';
import { useState } from 'react';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const getDateStr = (date: Date): string => {
  const str = [
    date.getFullYear(),
    date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1,
    date.getDate() < 10 ? `0${date.getDate()}` : date.getDate(),
  ].join('-');
  return str;
};

const diffDays = (start: Date, end: Date): number => {
  return (
    (Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()) -
      Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())) /
    MS_PER_DAY
  );
};

interface TaskListProps {
  tasks: Task[];
  updateTask: (task: Task) => void;
  refresh: () => Promise<void>;
  setStagedId: (id: string) => void;
}

const getDateSections = (tasks: Task[]): Map<string, Set<Task>> => {
  const dates = new Map<string, Set<Task>>();
  tasks.forEach((task) => {
    if (task.dueDate !== undefined) {
      const dueDate = task.dueDate.toDateString();
      if (dates.has(dueDate)) dates.get(dueDate)?.add(task);
      else dates.set(dueDate, new Set([task]));
    }
  });
  return dates;
};

export const TaskList = (props: TaskListProps): React.JSX.Element => {
  const sections = Array.from(getDateSections(props.tasks)).sort(
    ([date1], [date2]) => (moment(date1).isAfter(moment(date2)) ? 1 : -1)
  );
  const [task, setTask] = useState<Task>(props.tasks[0] ?? new Task());

  const onTaskChecked = (checkedTask: Task): void => {
    if (props.tasks.every((task) => task.completed))
      props.setStagedId(checkedTask.crossDesignId);
  };

  return (
    <>
      <TaskRescheduleModal
        task={task}
        updateTask={props.updateTask}
        tasks={props.tasks}
      />
      <div className='flex flex-col gap-2'>
        {sections.map(([date, section]) => (
          <div key={date} className='collapse'>
            <input type='checkbox' defaultChecked />
            <div className='collapse-title border-b-2 text-xl'>{date}</div>
            <div className='collapse-content mt-2'>
              {[...section].map((task, idx) => (
                <div key={idx}>
                  {idx !== 0 && <div className='divider m-0' />}
                  <TaskItem
                    refresh={props.refresh}
                    task={task}
                    updateTask={props.updateTask}
                    onTaskChecked={onTaskChecked}
                    setTaskToReschedule={setTask}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const TaskRescheduleModal = (props: {
  task: Task;
  updateTask: (task: Task) => void;
  tasks: Task[];
}): React.JSX.Element => {
  const [preview, setPreview] = useState(false);
  const [date, setDate] = useState<Date>(props.task.dueDate ?? new Date());
  const [prevTaskId, setPrevTaskId] = useState<string>();
  if (prevTaskId !== props.task.id) {
    setPrevTaskId(props.task.id);
    setPreview(false);
    setDate(props.task.dueDate ?? new Date());
  }
  const delta =
    props.task.dueDate === undefined
      ? undefined
      : diffDays(props.task.dueDate, date);
  const getNewDate = (oldDate: Date): Date => {
    return date === undefined || delta === undefined
      ? date
      : new Date(oldDate.getTime() + delta * MS_PER_DAY);
  };
  return (
    <div>
      <input
        type='checkbox'
        id={`task-reschedule-modal`}
        className='modal-toggle'
      />
      <div className='modal'>
        <div className='modal-box'>
          {preview ? (
            <div>
              <h2 className='text-xl font-bold'>
                Preview Reschedule Task:{' '}
                <span className='text-primary'>
                  {delta !== undefined
                    ? `${delta >= 0 ? '+' : '-'} ${Math.abs(delta)} ${
                        Math.abs(delta) === 1 ? 'Day' : 'Days'
                      }`
                    : date.toDateString()}
                </span>
              </h2>
              <div className='divider' />
              <TaskDelayPreview
                tasks={props.task.getDescendents(props.tasks)}
                getNewDate={getNewDate}
              />
              <div className='modal-action'>
                <button
                  className='btn btn-secondary'
                  onClick={() => {
                    setPreview(false);
                  }}
                >
                  Back
                </button>
                <label
                  className='btn btn-primary'
                  htmlFor='task-reschedule-modal'
                  onClick={() => {
                    props.task.getDescendents(props.tasks).forEach((task) => {
                      task.dueDate = getNewDate(task.dueDate);
                      props.updateTask(task);
                    });
                  }}
                >
                  Reschedule
                </label>
              </div>
            </div>
          ) : (
            <div>
              <h2 className='text-xl font-bold'>Reschedule Task</h2>
              <h3>
                <TaskStatement task={props.task ?? new Task()} />
              </h3>
              <div className='divider' />
              <div>
                <span>Current date: </span>
                <span>
                  {props.task?.dueDate.toLocaleDateString('en', {
                    year: 'numeric',
                    day: '2-digit',
                    month: '2-digit',
                  })}
                </span>
              </div>
              <div>
                <span>Reschedule to </span>
                <input
                  type='date'
                  value={getDateStr(date)}
                  className='border-2 bg-base-100'
                  onChange={(event) => {
                    const newDate = new Date(event.target.value);
                    setDate(
                      new Date(
                        newDate.getTime() +
                          newDate.getTimezoneOffset() * 60 * 1000
                      )
                    );
                  }}
                />
              </div>
              <div className='modal-action'>
                <button
                  className='btn btn-primary'
                  onClick={() => {
                    setPreview(true);
                  }}
                >
                  Preview
                </button>
              </div>
            </div>
          )}
        </div>
        <label className='modal-backdrop' htmlFor='task-reschedule-modal' />
      </div>
    </div>
  );
};

const TaskDelayPreview = (props: {
  tasks: Task[];
  getNewDate: (date: Date) => Date;
}): React.JSX.Element => {
  const sections = Array.from(getDateSections(props.tasks)).sort(
    ([date1], [date2]) => (moment(date1).isAfter(moment(date2)) ? 1 : -1)
  );
  return (
    <>
      <div className='flex flex-col gap-2'>
        {sections.map(([date, section]) => (
          <div key={date}>
            <div className='text-l border-b-2'>
              {date}
              {' \u2192 '}
              <span className='font-bold text-primary'>
                {props.getNewDate(new Date(date)).toDateString()}
              </span>
            </div>
            <ul className='list-disc'>
              {[...section].map((task, i) => (
                <li key={i} className='ml-6'>
                  <TaskStatement task={task} />
                  {i !== 0 && <div className='divider m-0' />}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
};
