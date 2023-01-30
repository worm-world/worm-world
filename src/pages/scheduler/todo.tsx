import TodoItem from '../../components/Scheduler/components/todoItem';

const Todo = (): JSX.Element => {
  return (
    <div className='grid '>
      <div className='min-w-1000px m-6 '>
        <p className='text-4xl font-medium'> Current Tasks:</p>
      </div>
      {/* Heres where we will map out all the current steps that are specified by the backend */}
      <div className='min-w-1000px bg-base-300 text-center'>
        <TodoItem isMarried></TodoItem>
      </div>
      <div className='min-w-1000px bg-base-200 text-center'>
        <TodoItem isSingle></TodoItem>
      </div>
      <div className='min-w-1000px bg-base-300 text-center'>
        <TodoItem shouldFreeze></TodoItem>
      </div>
      <div className='min-w-1000px bg-base-200 text-center'>
        <TodoItem shouldPCR></TodoItem>
      </div>
    </div>
  );
};

export default Todo;
