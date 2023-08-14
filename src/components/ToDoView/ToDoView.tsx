import { deleteAllTasks, deleteTasks, getTasks, updateTask } from 'api/task';
import TaskList from 'components/TaskList/TaskList';
import { Task } from 'models/frontend/Task/Task';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { GiCheckboxTree as CrossDesignIcon } from 'react-icons/gi';
import { deleteCrossDesign, getFilteredCrossDesigns } from 'api/crossDesign';
import { BiHide, BiShow } from 'react-icons/bi';
import { SiMicrogenetics as GeneIcon } from 'react-icons/si';
import EditorContext from 'components/EditorContext/EditorContext';

export const ToDoView = (): React.JSX.Element => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [designNames, setDesignNames] = useState(new Map<string, string>());
  const [filteredOnDesignId, setFilteredOnDesignId] = useState<string>();
  const [stagedDesignId, setStagedDesignId] = useState<string>(); // Whose tasks are staged for deletion
  const [showCompleted, setShowCompleted] = useState(true);
  const [showGenes, setShowGenes] = useState(true);

  useEffect(() => {
    refreshTasks()
      .then(() => {
        setHasLoadedOnce(true);
      }) // prevents text from flashing on screen while loading tasks from db
      .catch((e) => toast.error('Unable to get data: ' + JSON.stringify(e)));

    refreshDesignNames().catch((e) =>
      toast.error('Unable to get crossDesignIds: ' + JSON.stringify(e))
    );
  }, []);

  const refreshTasks = async (): Promise<void> => {
    const tasks = await getTasks();
    setTasks(tasks.map((task) => new Task(task)));
  };

  const refreshDesignNames = async (): Promise<void> => {
    const crossDesigns = await getFilteredCrossDesigns({
      filters: [[['Editable', 'False']]],
      orderBy: [],
    });
    setDesignNames(
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

  const handleDeleteTasks = (designId?: string): void => {
    (designId === undefined
      ? deleteAllTasks().then(() => {
          [...designNames.keys()].map(
            async (crossDesignId) => await deleteCrossDesign(crossDesignId)
          );
        })
      : deleteTasks(designId).then(async () => {
          await deleteCrossDesign(designId);
        })
    )
      .then(refreshTasks)
      .then(() => {
        setFilteredOnDesignId(undefined);
      })
      .catch((e) =>
        toast.error('Unable to delete tasks: ' + JSON.stringify(e))
      );
  };

  const hasFilter = filteredOnDesignId !== undefined;
  const crossDesignIds = new Set<string>(
    tasks.map((task) => task.crossDesignId)
  );
  const filteredTasks = tasks.filter(
    (task) =>
      (!hasFilter || task.crossDesignId === filteredOnDesignId) &&
      (showCompleted || !task.completed)
  );

  return (
    <div>
      {hasLoadedOnce && tasks.length === 0 ? (
        <NoTaskPlaceholder />
      ) : (
        <EditorContext.Provider value={{ showGenes }}>
          <TaskDeleteModal
            tasks={tasks.filter(
              (task) => task.crossDesignId === stagedDesignId
            )}
            crossDesignName={
              stagedDesignId !== undefined
                ? designNames.get(stagedDesignId)
                : ''
            }
            stagedId={stagedDesignId}
            clearStagedDesignId={() => {
              setStagedDesignId(undefined);
            }}
            deleteTasks={() => {
              handleDeleteTasks(stagedDesignId);
            }}
          />
          <div className='flex gap-2'>
            <div className='flex-grow'>
              <CrossDesignFilter
                setFilteredOnDesignId={setFilteredOnDesignId}
                crossDesignIds={crossDesignIds}
                designNames={designNames}
              />
            </div>
            <div className='flex gap-2 justify-self-end'>
              <ShowCompletedButton
                showCompleted={showCompleted}
                toggleShowCompleted={() => {
                  setShowCompleted(!showCompleted);
                }}
              />
              <ShowGenesButton
                toggleShowGenes={() => {
                  setShowGenes(!showGenes);
                }}
              />
              <TaskRemovalButton
                tasks={tasks}
                hasFilter={hasFilter}
                filteredOnDesignId={filteredOnDesignId}
                designNames={designNames}
                deleteTasks={handleDeleteTasks}
                clearStagedDesignId={() => {
                  setStagedDesignId(undefined);
                }}
              />
            </div>
          </div>
          <TaskList
            refresh={refreshTasks}
            tasks={filteredTasks}
            updateTask={handleUpdateTask}
            setStagedDesignId={setStagedDesignId}
          />
        </EditorContext.Provider>
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

const ShowGenesButton = (props: {
  toggleShowGenes: () => void;
}): React.JSX.Element => {
  return (
    <div className='tooltip tooltip-bottom' data-tip={'Show genes'}>
      <button className='btn btn-outline' onClick={props.toggleShowGenes}>
        <GeneIcon size='20' />
      </button>
    </div>
  );
};

const TaskRemovalButton = (props: {
  hasFilter: boolean;
  filteredOnDesignId?: string;
  designNames: Map<string, string>;
  tasks: Task[];
  deleteTasks: (crossDesignId?: string) => void;
  clearStagedDesignId: () => void;
}): React.JSX.Element => {
  const crossDesignName =
    props.filteredOnDesignId === undefined
      ? undefined
      : props.designNames.get(props.filteredOnDesignId);
  return (
    <div>
      <label htmlFor='delete-tasks-modal' className='btn btn-error btn-outline'>
        {props.hasFilter ? 'Delete tasks' : 'Delete all tasks'}
      </label>
      <input type='checkbox' id='delete-tasks-modal' className='modal-toggle' />
      <label htmlFor='delete-tasks-modal' className='modal cursor-pointer'>
        <label className='modal-box relative text-center' htmlFor=''>
          <h2 className='text-3xl font-bold'>Delete Tasks</h2>
          <div className='divider' />
          <p className='text-lg'>
            {props.hasFilter ? (
              `Are you sure you want to remove tasks for "${crossDesignName}"? This cannot be undone.`
            ) : (
              <span>
                Are you sure you want to remove{' '}
                <span className='font-bold'> all </span> tasks? This will delete
                every task from every cross design.
              </span>
            )}
          </p>

          <div className='modal-action justify-center'>
            <label
              htmlFor='delete-tasks-modal'
              className='btn btn-error'
              onClick={() => {
                props.deleteTasks(props.filteredOnDesignId);
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

const TaskDeleteModal = (props: {
  tasks: Task[];
  crossDesignName?: string;
  stagedId?: string;
  clearStagedDesignId: () => void;
  deleteTasks: () => void;
}): React.JSX.Element => {
  return (
    <>
      <input type='checkbox' className='modal-toggle' />
      <div className={`modal ${props.stagedId !== undefined && 'modal-open'}`}>
        <div className='modal-box relative text-center'>
          <h2 className='text-3xl font-bold'>
            {props.crossDesignName} Complete
          </h2>
          <div className='divider' />
          <p className='text-lg'>
            You have completed all tasks for {props.crossDesignName}. Would you
            like to remove them?
          </p>
          <div className='modal-action justify-center'>
            <button
              className='btn btn-success'
              onClick={() => {
                props.deleteTasks();
                props.clearStagedDesignId();
              }}
            >
              Remove
            </button>
            <button
              className='btn'
              onClick={() => {
                props.clearStagedDesignId();
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
  setFilteredOnDesignId: (id?: string) => void;
  crossDesignIds: Set<string>;
  designNames: Map<string, string>;
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
          props.setFilteredOnDesignId(
            e.target.value === '' ? undefined : e.target.value
          );
        }}
        className='select select-primary w-full max-w-xs'
      >
        <option value={''}>{'No Filter'}</option>
        {Array.from(props.crossDesignIds).map((id: string) => {
          return (
            <option key={id} value={id}>
              {props.designNames.get(id)}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default ToDoView;
