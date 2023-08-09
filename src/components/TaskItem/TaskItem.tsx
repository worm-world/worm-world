import StrainCard from 'components/StrainCard/StrainCard';
import { type Task } from 'models/frontend/Task/Task';
import {
  TbSnowflake as FreezeIcon,
  TbMicroscope as PCRIcon,
  TbArrowLoopLeft as SelfCrossIcon,
  TbBinaryTree as TreeIcon,
} from 'react-icons/tb';
import {
  BiX as CrossIcon,
  BiCalendar as CalendarIcon,
  BiComment as CommentIcon,
} from 'react-icons/bi';
import { FaArrowRight as RightIcon } from 'react-icons/fa';
import { type Action } from 'models/db/task/db_Action';
import { useNavigate } from 'react-router-dom';
import React, { useCallback, useRef } from 'react';

const useFocus = (): [React.RefObject<HTMLTextAreaElement>, () => void] => {
  const htmlElRef = useRef<HTMLTextAreaElement>(null);
  const setFocus = (): void => {
    htmlElRef.current?.focus();
  };

  return [htmlElRef, setFocus];
};

interface TaskItemProps {
  task: Task;
  updateTask: (task: Task) => void;
  refresh: () => Promise<void>;
  onTaskChecked: (task: Task) => void;
  setTaskToReschedule: (task: Task) => void;
}

const TaskItem = (props: TaskItemProps): React.JSX.Element => {
  const navigate = useNavigate();
  const navigateToCrossDesign = useCallback((): void => {
    navigate('/editor', {
      state: { crossDesignId: props.task.crossDesignId },
    });
  }, [props.task.crossDesignId]);
  const { action, hermStrain, maleStrain, resultStrain, completed } = {
    ...props.task,
  };

  const [textareaRef, setTextareaFocus] = useFocus();

  return (
    <div className='group flex flex-col gap-2'>
      <div className='flex items-center gap-2'>
        <input
          type='checkbox'
          className='checkbox-accent checkbox'
          checked={completed}
          readOnly
          onClick={(e) => {
            props.task.completed = e.currentTarget.checked;
            props.updateTask(props.task);
            props.onTaskChecked(props.task);
          }}
        />
        {hermStrain !== undefined && <StrainCard strain={hermStrain} id={''} />}
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full text-primary-content ${getIconColor(
            action
          )}`}
        >
          <ActionIcon action={action} />
        </div>
        {maleStrain !== undefined && <StrainCard strain={maleStrain} id={''} />}
        <RightIcon size='20' />
        {resultStrain !== undefined && (
          <StrainCard strain={resultStrain} id={''} />
        )}
        <div className='invisible ml-auto mr-6 self-start group-hover:visible'>
          <div className='tooltip tooltip-bottom' data-tip={'Add comment'}>
            <button
              className='btn btn-ghost'
              onClick={() => {
                props.task.notes = props.task.notes ?? '';
                props.updateTask(props.task);
                setTextareaFocus();
              }}
            >
              <CommentIcon size='20' />
            </button>
          </div>
          <div className='tooltip tooltip-bottom' data-tip={'Reschedule task'}>
            <label
              className='btn btn-ghost'
              htmlFor='task-reschedule-modal'
              onClick={() => {
                props.setTaskToReschedule(props.task);
              }}
            >
              <CalendarIcon size='20' />
            </label>
          </div>
          <div
            className='tooltip tooltip-bottom'
            data-tip={'View cross design'}
          >
            <button className='btn btn-ghost' onClick={navigateToCrossDesign}>
              <TreeIcon size='20' />
            </button>
          </div>
        </div>
      </div>
      {props.task.notes !== undefined && (
        <textarea
          ref={textareaRef}
          value={props.task.notes}
          onChange={(e) => {
            props.task.notes = e.target.value;
            props.updateTask(props.task);
          }}
          className='ml-8 flex-grow resize-none rounded border-2 bg-inherit p-2'
          autoFocus={props.task.notes === ''}
          onBlur={() => {
            if (props.task.notes === '') {
              props.task.notes = undefined;
              props.updateTask(props.task);
            }
          }}
        />
      )}
    </div>
  );
};

export const TaskStatement = (props: { task: Task }): React.JSX.Element => {
  const { action, hermStrain, maleStrain, resultStrain } = { ...props.task };
  switch (action) {
    case 'Cross':
      return (
        <div>
          <span className='font-extrabold'>Cross </span>
          {hermStrain.genotype}
          <span className='font-extrabold'> with </span>
          {maleStrain?.genotype}
          <span className='font-extrabold'> to yield </span>
          {resultStrain?.genotype}
        </div>
      );
    case 'SelfCross':
      return (
        <div>
          <span className='font-extrabold'>Self-cross </span>
          {hermStrain.genotype}
          <span className='font-extrabold'> to yield </span>
          {resultStrain?.genotype}
        </div>
      );
    case 'Freeze':
      return (
        <div>
          <span className='font-extrabold'>Freeze </span>
          {hermStrain.genotype}
        </div>
      );
    case 'Pcr':
      return (
        <div>
          <span className='font-extrabold'>Do PCR test on </span>
          {hermStrain.genotype}
        </div>
      );
  }
};

const getIconColor = (action: Action): string => {
  switch (action) {
    case 'Cross':
      return 'bg-primary';
    case 'SelfCross':
      return 'bg-secondary';
    case 'Pcr':
      return 'bg-accent';
    case 'Freeze':
      return 'bg-accent';
  }
};

const ActionIcon = (props: { action: Action }): React.JSX.Element => {
  switch (props.action) {
    case 'Cross':
      return <CrossIcon size='30' />;
    case 'SelfCross':
      return <SelfCrossIcon size='20' />;
    case 'Freeze':
      return <FreezeIcon size='20' />;
    case 'Pcr':
      return <PCRIcon size='20' />;
  }
};

export default TaskItem;
