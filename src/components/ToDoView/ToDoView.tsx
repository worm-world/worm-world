import { deleteAllTasks, deleteTasks, getTasks, updateTask } from 'api/task';
import { TaskList } from 'components/TaskList/TaskList';
import { Task } from 'models/frontend/Task/Task';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { GiCheckboxTree as CrossDesignIcon } from 'react-icons/gi';
import { deleteCrossDesign, getFilteredCrossDesigns } from 'api/crossDesign';
import { BiHide, BiShow } from 'react-icons/bi';

export const ToDoView = (): React.JSX.Element => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [crossDesignNames, setCrossDesignNames] = useState(
    new Map<string, string>()
  );
  const [filteringId, setFilteringId] = useState<string>();
  const [stagedId, setStagedId] = useState<string>();
  const [showCompleted, setShowCompleted] = useState(true);

  useEffect(() => {
    refreshTasks()
      .then(() => {
        setHasLoadedOnce(true);
      }) // prevents text from flashing on screen while loading tasks from db
      .catch((e) => toast.error('Unable to get data: ' + JSON.stringify(e)));

    refreshCrossDesignNames().catch((e) =>
      toast.error('Unable to get crossDesignIds: ' + JSON.stringify(e))
    );
  }, []);

  const refreshTasks = async (): Promise<void> => {
    const tasks = await getTasks();
    setTasks(tasks.map((task) => new Task(task)));
  };

  const refreshCrossDesignNames = async (): Promise<void> => {
    const crossDesigns = await getFilteredCrossDesigns({
      filters: [[['Editable', 'False']]],
      orderBy: [],
    });
    setCrossDesignNames(
      new Map(
        crossDesigns.map((crossDesign) => [crossDesign.id, crossDesign.name])
      )
    );
  };

  const handleUpdateTask = (task: Task): void => {
    updateTask(task.generateRecord())
      .then(refreshTasks)
      .catch((e) => toast.error('Unable to update task: ' + JSON.stringify(e)));
  };

  const handleDeleteTasks = (filteringId?: string): void => {
    (filteringId === undefined
      ? deleteAllTasks().then(() => {
          [...crossDesignNames.keys()].map(
            async (crossDesignId) => await deleteCrossDesign(crossDesignId)
          );
        })
      : deleteTasks(filteringId).then(async () => {
          await deleteCrossDesign(filteringId);
        })
    )
      .then(refreshTasks)
      .then(() => {
        setFilteringId(undefined);
      })
      .catch((e) =>
        toast.error('Unable to delete tasks: ' + JSON.stringify(e))
      );
  };

  const onTaskChecked = (checkedTask: Task): void => {
    if (
      tasks
        .filter((task) => task.crossDesignId === checkedTask.crossDesignId)
        .every((task) => task.completed)
    )
      setStagedId(checkedTask.crossDesignId);
  };

  const hasFilter = filteringId !== undefined;
  const crossDesignIds = new Set<string>(
    tasks.map((task) => task.crossDesignId)
  );
  const filteredTasks = tasks.filter(
    (task) =>
      (!hasFilter || task.crossDesignId === filteringId) &&
      (showCompleted || !task.completed)
  );

  return (
    <div>
      {hasLoadedOnce && tasks.length === 0 ? (
        <NoTaskPlaceholder />
      ) : (
        <div>
          <div className='flex gap-2'>
            <div className='flex-grow'>
              <CrossDesignFilter
                setFilteringId={setFilteringId}
                crossDesignIds={crossDesignIds}
                crossDesignNames={crossDesignNames}
              />
            </div>
            <ShowCompletedButton
              showCompleted={showCompleted}
              toggleShowCompleted={() => {
                setShowCompleted(!showCompleted);
              }}
            />
            <div className='justify-self-end'>
              <TaskRemovalBtn
                hasFilter={hasFilter}
                filteringId={filteringId}
                crossDesignName={
                  filteringId === undefined
                    ? undefined
                    : crossDesignNames.get(filteringId)
                }
                deleteTasks={handleDeleteTasks}
              />
            </div>
            <TaskDeletePrompt
              tasks={tasks.filter((task) => task.crossDesignId === filteringId)}
              crossDesignNames={crossDesignNames}
              stagedId={stagedId}
              clearStagedId={() => {
                setStagedId(undefined);
              }}
              deleteTasks={handleDeleteTasks}
            />
          </div>
          <TaskList
            refresh={refreshTasks}
            tasks={filteredTasks}
            updateTask={handleUpdateTask}
            onTaskChecked={onTaskChecked}
          />
        </div>
      )}
    </div>
  );
};

const NoTaskPlaceholder = (): React.JSX.Element => {
  return (
    <div className='m-14 flex flex-col items-center justify-center'>
      <h2 className='text-2xl'>No scheduled tasks yet.</h2>
      <h3 className='my-4 text-xl'>
        Tasks can be scheduled when viewing a cross design in the editor.
      </h3>
      <CrossDesignIcon className='my-4 text-9xl text-base-300' />
    </div>
  );
};

interface ShowCompletedButtonProps {
  showCompleted: boolean;
  toggleShowCompleted: () => void;
}

const ShowCompletedButton = (
  props: ShowCompletedButtonProps
): React.JSX.Element => {
  const tooltipText = props.showCompleted
    ? 'Hide completed tasks'
    : 'Show completed tasks';
  return (
    <div className='tooltip tooltip-bottom' data-tip={tooltipText}>
      <button className='btn btn-outline' onClick={props.toggleShowCompleted}>
        {props.showCompleted ? <BiShow size='20' /> : <BiHide size='20' />}
      </button>
    </div>
  );
};

const TaskRemovalBtn = (props: {
  hasFilter: boolean;
  filteringId?: string;
  crossDesignName?: string;
  deleteTasks: (crossDesignId?: string) => void;
}): React.JSX.Element => {
  const removeBtnTxt = props.hasFilter ? 'Delete tasks' : 'Delete all tasks';
  const modalHeader = 'Delete tasks';
  const confirmationText = props.hasFilter
    ? `Are you sure you want to remove tasks for "${props.crossDesignName}"? This cannot be undone.`
    : 'Are you sure you want to remove ALL tasks? This will delete every task from every cross design.';
  return (
    <div>
      <label htmlFor='delete-tasks-modal' className='btn btn-error btn-outline'>
        {removeBtnTxt}
      </label>
      <input type='checkbox' id='delete-tasks-modal' className='modal-toggle' />
      <label htmlFor='delete-tasks-modal' className='modal cursor-pointer'>
        <label className='modal-box relative text-center' htmlFor=''>
          <h2 className='text-3xl font-bold'>{modalHeader}</h2>
          <div className='divider' />
          <p className='text-lg'>{confirmationText}</p>

          <div className='modal-action justify-center'>
            <label
              htmlFor='delete-tasks-modal'
              className='btn btn-error'
              onClick={() => {
                props.deleteTasks(props.filteringId);
              }}
            >
              Delete
            </label>
            <label htmlFor='delete-tasks-modal' className='btn'>
              Cancel
            </label>
          </div>
        </label>
      </label>
    </div>
  );
};

const TaskDeletePrompt = (props: {
  tasks: Task[];
  crossDesignNames: Map<string, string>;
  stagedId?: string;
  clearStagedId: () => void;
  deleteTasks: () => void;
}): React.JSX.Element => {
  const name =
    props.stagedId !== undefined && props.crossDesignNames.get(props.stagedId);
  return (
    <>
      <input
        type='checkbox'
        id='task-delete-prompt-modal'
        className='modal-toggle'
      />
      <div className={`modal ${props.stagedId !== undefined && 'modal-open'}`}>
        <div className='modal-box relative text-center'>
          <h2 className='text-3xl font-bold'>{name} Complete</h2>
          <div className='divider' />
          <p className='text-lg'>
            You have completed all tasks for {name}. Would you like to remove
            them?
          </p>
          <div className='modal-action justify-center'>
            <button
              className='btn btn-success'
              onClick={() => {
                props.deleteTasks();
                props.clearStagedId();
              }}
            >
              Remove
            </button>
            <button
              className='btn'
              onClick={() => {
                props.clearStagedId();
              }}
            >
              Keep
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

interface CrossDesignFilterProps {
  setFilteringId: (id?: string) => void;
  crossDesignIds: Set<string>;
  crossDesignNames: Map<string, string>;
}

const CrossDesignFilter = (
  props: CrossDesignFilterProps
): React.JSX.Element => {
  return (
    <div className='flex flex-col'>
      <label>
        <span className='label-text'>Filter Tasks By Cross Design</span>
      </label>
      <select
        onChange={(e) => {
          props.setFilteringId(
            e.target.value === '' ? undefined : e.target.value
          );
        }}
        className='select select-primary w-full max-w-xs'
      >
        <option value={''}>{'No Filter'}</option>
        {Array.from(props.crossDesignIds).map((id: string) => {
          return (
            <option key={id} value={id}>
              {props.crossDesignNames.get(id)}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default ToDoView;
