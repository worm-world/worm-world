import { deleteAllTasks, deleteTasks, getTasks, updateDbTask } from 'api/task';
import { TaskView } from 'components/TaskView/TaskView';
import { Task } from 'models/frontend/Task/Task';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { GiCheckboxTree as TreeIcon } from 'react-icons/gi';
import { getTrees } from 'api/crossTree';
import { BiHide, BiShow } from 'react-icons/bi';

export const SchedulePage = (): JSX.Element => {
  const noFilterText = 'No filter';
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [treeNames, setTreeNames] = useState(new Map<string, string>());
  const [filteredTreeId, setFilteredTreeId] = useState<string>(noFilterText);
  const [promptRemovalTasks, setPromptRemovalTasks] = useState<Task[]>([]);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    refreshTasks()
      .then(() => setHasLoadedOnce(true)) // prevents text from flashing on screen while loading tasks from db
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
    const trees = await getTrees();
    setTreeNames(new Map(trees.map((tree) => [tree.id, tree.name])));
  };

  const updateTask = (task: Task): void => {
    const filteredTasks = tasks.filter((t) => t.treeId === task.treeId);
    updateDbTask(task.generateRecord())
      .then(() => setPromptRemovalTasks(filteredTasks))
      .then(refreshTasks)
      .catch((e) => toast.error('Unable to update task: ' + JSON.stringify(e)));
  };

  const handleDeleteTasks = (treeId: string): void => {
    const deleteFn =
      treeId === noFilterText
        ? async () => await deleteAllTasks()
        : async () => await deleteTasks(treeId);

    deleteFn()
      .then(refreshTasks)
      .then(() => setFilteredTreeId(noFilterText))
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
        setFilteredTreeId(noFilterText);
      })
      .then(refreshTasks)
      .catch((e) =>
        toast.error('Unable to delete tasks: ' + JSON.stringify(e))
      );
  };

  const hasFilter = filteredTreeId !== noFilterText;
  const treeIds = new Set<string>(tasks.map((task) => task.treeId));
  const filteredTasks = tasks.filter(
    (task) =>
      (!hasFilter || task.treeId === filteredTreeId) &&
      (showCompleted || !task.completed)
  );

  return (
    <div className='overflow-y-hidden'>
      {tasks.length === 0 && hasLoadedOnce && <NoTaskPlaceholder />}
      {tasks.length > 0 && hasLoadedOnce && (
        <>
          <TaskRemovalPrompt
            tasks={promptRemovalTasks}
            treeNames={treeNames}
            deleteTasks={handleDeleteTasksWithPrompt}
          />
          <div className='flex items-center justify-between'>
            <TreeFilter
              noFilterText={noFilterText}
              setFilteredTreeId={setFilteredTreeId}
              treeIds={treeIds}
              treeNames={treeNames}
            />
            <div className='flex flex-row items-end gap-2'>
              <ShowCompletedButton
                showCompleted={showCompleted}
                toggleShowCompleted={() => setShowCompleted(!showCompleted)}
              />
              <TaskRemovalBtn
                hasFilter={hasFilter}
                filteredTreeId={filteredTreeId}
                treeName={treeNames.get(filteredTreeId)}
                deleteTasks={handleDeleteTasks}
              />
            </div>
          </div>
          <TaskView
            refresh={refreshTasks}
            tasks={filteredTasks}
            updateTask={updateTask}
          />
        </>
      )}
    </div>
  );
};

const NoTaskPlaceholder = (): JSX.Element => {
  return (
    <div className='m-14 flex flex-col items-center justify-center'>
      <h2 className='text-2xl'>No scheduled tasks yet.</h2>
      <h3 className='my-4 text-xl'>
        Use the Cross Designer to send cross tasks to the scheduler.
      </h3>
      <TreeIcon className='my-4 text-9xl text-base-300' />
    </div>
  );
};

interface TreeFilterProps {
  setFilteredTreeId: (id: string) => void;
  noFilterText: string;
  treeIds: Set<string>;
  treeNames: Map<string, string>;
}

const TreeFilter = (props: TreeFilterProps): JSX.Element => {
  return (
    <div>
      <label>
        <span className='label-text'>Filter Tasks By Cross Tree</span>
      </label>
      <select
        onChange={(e) => props.setFilteredTreeId(e.target.value)}
        className='select-primary select w-full max-w-xs'
      >
        <option>{props.noFilterText}</option>
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

interface ShowCompletedButtonProps {
  showCompleted: boolean;
  toggleShowCompleted: () => void;
}

const ShowCompletedButton = (props: ShowCompletedButtonProps): JSX.Element => {
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
  filteredTreeId: string;
  treeName?: string;
  deleteTasks: (treeId: string) => void;
}): JSX.Element => {
  const removeBtnTxt = props.hasFilter ? 'Delete tasks' : 'Delete all tasks';
  const modalHeader = 'Delete tasks';
  const confirmationText = props.hasFilter
    ? `Are you sure you want to remove tasks for "${props.treeName}"? This cannot be undone.`
    : 'Are you sure you want to remove ALL tasks? This will delete every task from every cross tree.';
  return (
    <div>
      <label htmlFor='delete-tasks-modal' className='btn-outline btn-error btn'>
        {removeBtnTxt}
      </label>
      <input
        type='checkbox'
        id='delete-tasks-modal'
        className='modal-toggle btn-error btn'
      />
      <label htmlFor='delete-tasks-modal' className='modal cursor-pointer'>
        <label className='modal-box relative text-center' htmlFor=''>
          <h2 className='text-3xl font-bold'>{modalHeader}</h2>
          <div className='divider' />
          <p className='text-lg'>{confirmationText}</p>

          <div className='modal-action justify-center'>
            <label
              htmlFor='delete-tasks-modal'
              className='btn-error btn'
              onClick={() => props.deleteTasks(props.filteredTreeId)}
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

const TaskRemovalPrompt = (props: {
  tasks: Task[];
  treeNames: Map<string, string>;
  deleteTasks: () => void;
}): JSX.Element => {
  const allCompleted: boolean = props.tasks.reduce(
    (prevVal: boolean, task) => prevVal && task.completed,
    true
  );

  if (props.tasks.length === 0 || !allCompleted) return <></>;
  const [modalOpen, setModalOpen] = useState(true);

  const modalClass = modalOpen
    ? 'modal-open modal cursor-pointer'
    : 'modal cursor-pointer';

  const treeName = props.treeNames.get(props.tasks[0].treeId);
  const modalHeader = `"${treeName}" complete`;
  const confirmationText = `Great job! It looks like you've completed all tasks for "${treeName}". Would you like to clear them out of the scheduler?`;
  return (
    <>
      <label htmlFor='prompt-delete-tasks-modal' className={modalClass}>
        <label className='modal-box relative text-center' htmlFor=''>
          <h2 className='text-3xl font-bold'>{modalHeader}</h2>
          <div className='divider' />
          <p className='text-lg'>{confirmationText}</p>
          <div className='modal-action justify-center'>
            <label
              htmlFor='prompt-delete-tasks-modal'
              className='btn-success btn'
              onClick={() => {
                props.deleteTasks();
                setModalOpen(false);
              }}
            >
              Clear them out!
            </label>
            <label
              htmlFor='prompt-delete-tasks-modal'
              className='btn'
              onClick={() => setModalOpen(false)}
            >
              No thanks
            </label>
          </div>
        </label>
      </label>
    </>
  );
};

export default SchedulePage;
