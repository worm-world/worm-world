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
  const [filteredCrossDesignId, setFilteredCrossDesignId] = useState<string>();
  const [promptRemovalTasks, setPromptRemovalTasks] = useState<Task[]>([]);
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
    const filteredTasks = tasks.filter(
      (t) => t.crossDesignId === task.crossDesignId
    );
    updateTask(task.generateRecord())
      .then(() => {
        setPromptRemovalTasks(filteredTasks);
      })
      .then(refreshTasks)
      .catch((e) => toast.error('Unable to update task: ' + JSON.stringify(e)));
  };

  const handleDeleteTasks = (filteredCrossDesignId?: string): void => {
    (filteredCrossDesignId === undefined
      ? deleteAllTasks().then(() => {
          [...crossDesignNames.keys()].map(
            async (crossDesignId) => await deleteCrossDesign(crossDesignId)
          );
        })
      : deleteTasks(filteredCrossDesignId).then(async () => {
          await deleteCrossDesign(filteredCrossDesignId);
        })
    )
      .then(refreshTasks)
      .then(() => {
        setFilteredCrossDesignId(undefined);
      })
      .catch((e) =>
        toast.error('Unable to delete tasks: ' + JSON.stringify(e))
      );
  };

  const handleDeleteTasksWithPrompt = (): void => {
    if (promptRemovalTasks.length === 0) return;
    const crossDesignId = promptRemovalTasks[0].crossDesignId;
    deleteTasks(crossDesignId)
      .then(() => {
        setPromptRemovalTasks([]);
        setFilteredCrossDesignId(undefined);
      })
      .then(refreshTasks)
      .catch((e) =>
        toast.error('Unable to delete tasks: ' + JSON.stringify(e))
      );
  };

  const hasFilter = filteredCrossDesignId !== undefined;
  const crossDesignIds = new Set<string>(
    tasks.map((task) => task.crossDesignId)
  );
  const filteredTasks = tasks.filter(
    (task) =>
      (!hasFilter || task.crossDesignId === filteredCrossDesignId) &&
      (showCompleted || !task.completed)
  );

  return (
    <>
      {tasks.length === 0 && hasLoadedOnce && <NoTaskPlaceholder />}
      {tasks.length > 0 && hasLoadedOnce && (
        <>
          <TaskDeletePrompt
            tasks={promptRemovalTasks}
            crossDesignNames={crossDesignNames}
            deleteTasks={handleDeleteTasksWithPrompt}
          />
          <div className='flex items-center justify-between'>
            <CrossDesignFilter
              setFilteredCrossDesignId={setFilteredCrossDesignId}
              crossDesignIds={crossDesignIds}
              crossDesignNames={crossDesignNames}
            />
            <div className='flex flex-row items-end gap-2'>
              <ShowCompletedButton
                showCompleted={showCompleted}
                toggleShowCompleted={() => {
                  setShowCompleted(!showCompleted);
                }}
              />
              <TaskRemovalBtn
                hasFilter={hasFilter}
                filteredCrossDesignId={filteredCrossDesignId}
                crossDesignName={
                  filteredCrossDesignId === undefined
                    ? undefined
                    : crossDesignNames.get(filteredCrossDesignId)
                }
                deleteTasks={handleDeleteTasks}
              />
            </div>
          </div>
          <TaskList
            refresh={refreshTasks}
            tasks={filteredTasks}
            updateTask={handleUpdateTask}
          />
        </>
      )}
    </>
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
      <button className='btn-outline btn' onClick={props.toggleShowCompleted}>
        {props.showCompleted ? <BiShow size='20' /> : <BiHide size='20' />}
      </button>
    </div>
  );
};

const TaskRemovalBtn = (props: {
  hasFilter: boolean;
  filteredCrossDesignId?: string;
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
      <label htmlFor='delete-tasks-modal' className='btn-error btn-outline btn'>
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
              className='btn-error btn'
              onClick={() => {
                props.deleteTasks(props.filteredCrossDesignId);
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
  deleteTasks: () => void;
}): React.JSX.Element => {
  const [modalOpen, setModalOpen] = useState(true);

  const allCompleted = props.tasks.every((task) => task.completed);
  if (props.tasks.length === 0 || !allCompleted) return <></>;

  const modalClass = modalOpen
    ? 'modal-open modal cursor-pointer'
    : 'modal cursor-pointer';

  const crossDesignName = props.crossDesignNames.get(
    props.tasks[0].crossDesignId
  );
  const modalHeader = `"${crossDesignName}" complete`;
  const confirmationText = `Great job! You've completed all tasks for "${crossDesignName}". Would you like to clear them?`;
  return (
    <>
      <label htmlFor='task-delete-prompt-modal' className={modalClass}>
        <label className='modal-box relative text-center' htmlFor=''>
          <h2 className='text-3xl font-bold'>{modalHeader}</h2>
          <div className='divider' />
          <p className='text-lg'>{confirmationText}</p>
          <div className='modal-action justify-center'>
            <label
              htmlFor='task-delete-prompt-modal'
              className='btn-success btn'
              onClick={() => {
                props.deleteTasks();
                setModalOpen(false);
              }}
            >
              Clear them out!
            </label>
            <label
              htmlFor='task-delete-prompt-modal'
              className='btn'
              onClick={() => {
                setModalOpen(false);
              }}
            >
              No thanks
            </label>
          </div>
        </label>
      </label>
    </>
  );
};

interface CrossDesignFilterProps {
  setFilteredCrossDesignId: (id?: string) => void;
  crossDesignIds: Set<string>;
  crossDesignNames: Map<string, string>;
}

const CrossDesignFilter = (
  props: CrossDesignFilterProps
): React.JSX.Element => {
  return (
    <div>
      <label>
        <span className='label-text'>Filter Tasks By Cross CrossDesign</span>
      </label>
      <select
        onChange={(e) => {
          props.setFilteredCrossDesignId(
            e.target.value === '' ? undefined : e.target.value
          );
        }}
        className='select-primary select w-full max-w-xs'
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
