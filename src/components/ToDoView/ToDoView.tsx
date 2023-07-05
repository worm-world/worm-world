import { deleteAllTasks, deleteTasks, getTasks, updateTask } from 'api/task';
import { TaskList } from 'components/TaskList/TaskList';
import { Task } from 'models/frontend/Task/Task';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { GiCheckboxTree as TreeIcon } from 'react-icons/gi';
import { deleteTree, getFilteredTrees } from 'api/tree';
import { BiHide, BiShow } from 'react-icons/bi';

export const ToDoView = (): React.JSX.Element => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [treeNames, setTreeNames] = useState(new Map<string, string>());
  const [filteredTreeId, setFilteredTreeId] = useState<string>();
  const [promptRemovalTasks, setPromptRemovalTasks] = useState<Task[]>([]);
  const [showCompleted, setShowCompleted] = useState(true);

  useEffect(() => {
    refreshTasks()
      .then(() => {
        setHasLoadedOnce(true);
      }) // prevents text from flashing on screen while loading tasks from db
      .catch((e) => toast.error('Unable to get data: ' + JSON.stringify(e)));

    refreshTreeNames().catch((e) =>
      toast.error('Unable to get treeIds: ' + JSON.stringify(e))
    );
  }, []);

  const refreshTasks = async (): Promise<void> => {
    const tasks = await getTasks();
    setTasks(tasks.map((task) => new Task(task)));
  };

  const refreshTreeNames = async (): Promise<void> => {
    const trees = await getFilteredTrees({
      filters: [[['Editable', 'False']]],
      orderBy: [],
    });
    setTreeNames(new Map(trees.map((tree) => [tree.id, tree.name])));
  };

  const handleUpdateTask = (task: Task): void => {
    const filteredTasks = tasks.filter((t) => t.treeId === task.treeId);
    updateTask(task.generateRecord())
      .then(() => {
        setPromptRemovalTasks(filteredTasks);
      })
      .then(refreshTasks)
      .catch((e) => toast.error('Unable to update task: ' + JSON.stringify(e)));
  };

  const handleDeleteTasks = (filteredTreeId?: string): void => {
    (filteredTreeId === undefined
      ? deleteAllTasks().then(() => {
          [...treeNames.keys()].map(async (treeId) => await deleteTree(treeId));
        })
      : deleteTasks(filteredTreeId).then(async () => {
          await deleteTree(filteredTreeId);
        })
    )
      .then(refreshTasks)
      .then(() => {
        setFilteredTreeId(undefined);
      })
      .catch((e) =>
        toast.error('Unable to delete tasks: ' + JSON.stringify(e))
      );
  };

  const handleDeleteTasksWithPrompt = (): void => {
    if (promptRemovalTasks.length === 0) return;
    const treeId = promptRemovalTasks[0].treeId;
    deleteTasks(treeId)
      .then(() => {
        setPromptRemovalTasks([]);
        setFilteredTreeId(undefined);
      })
      .then(refreshTasks)
      .catch((e) =>
        toast.error('Unable to delete tasks: ' + JSON.stringify(e))
      );
  };

  const hasFilter = filteredTreeId !== undefined;
  const treeIds = new Set<string>(tasks.map((task) => task.treeId));
  const filteredTasks = tasks.filter(
    (task) =>
      (!hasFilter || task.treeId === filteredTreeId) &&
      (showCompleted || !task.completed)
  );

  return (
    <>
      {tasks.length === 0 && hasLoadedOnce && <NoTaskPlaceholder />}
      {tasks.length > 0 && hasLoadedOnce && (
        <>
          <TaskDeletePrompt
            tasks={promptRemovalTasks}
            treeNames={treeNames}
            deleteTasks={handleDeleteTasksWithPrompt}
          />
          <div className='flex items-center justify-between'>
            <TreeFilter
              setFilteredTreeId={setFilteredTreeId}
              treeIds={treeIds}
              treeNames={treeNames}
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
                filteredTreeId={filteredTreeId}
                treeName={
                  filteredTreeId === undefined
                    ? undefined
                    : treeNames.get(filteredTreeId)
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
      <TreeIcon className='my-4 text-9xl text-base-300' />
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
  filteredTreeId?: string;
  treeName?: string;
  deleteTasks: (treeId?: string) => void;
}): React.JSX.Element => {
  const removeBtnTxt = props.hasFilter ? 'Delete tasks' : 'Delete all tasks';
  const modalHeader = 'Delete tasks';
  const confirmationText = props.hasFilter
    ? `Are you sure you want to remove tasks for "${props.treeName}"? This cannot be undone.`
    : 'Are you sure you want to remove ALL tasks? This will delete every task from every cross design.';
  return (
    <div>
      <label htmlFor='delete-tasks-modal' className='btn-outline btn-error btn'>
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
                props.deleteTasks(props.filteredTreeId);
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
  treeNames: Map<string, string>;
  deleteTasks: () => void;
}): React.JSX.Element => {
  const [modalOpen, setModalOpen] = useState(true);

  const allCompleted = props.tasks.every((task) => task.completed);
  if (props.tasks.length === 0 || !allCompleted) return <></>;

  const modalClass = modalOpen
    ? 'modal-open modal cursor-pointer'
    : 'modal cursor-pointer';

  const treeName = props.treeNames.get(props.tasks[0].treeId);
  const modalHeader = `"${treeName}" complete`;
  const confirmationText = `Great job! You've completed all tasks for "${treeName}". Would you like to clear them?`;
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

interface TreeFilterProps {
  setFilteredTreeId: (id?: string) => void;
  treeIds: Set<string>;
  treeNames: Map<string, string>;
}

const TreeFilter = (props: TreeFilterProps): React.JSX.Element => {
  return (
    <div>
      <label>
        <span className='label-text'>Filter Tasks By Cross Tree</span>
      </label>
      <select
        onChange={(e) => {
          props.setFilteredTreeId(
            e.target.value === '' ? undefined : e.target.value
          );
        }}
        className='select-primary select w-full max-w-xs'
      >
        <option value={''}>{'No Filter'}</option>
        {Array.from(props.treeIds).map((id: string) => {
          return (
            <option key={id} value={id}>
              {props.treeNames.get(id)}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default ToDoView;
