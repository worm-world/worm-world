const TodoActions = (props: {}): JSX.Element => {
  return (
    <div className='ml-8 mr-8 w-80'>
      <input
        type='checkbox'
        className='checkbox-accent checkbox checkbox-lg absolute top-0 left-0 ml-8'
      />
      <div>
        <div className='grid grid-cols-1 place-items-start gap-4'>
          <p className='absolute top-0 ml-10 text-3xl'>Jan 19 9:00AM</p>
          <div className='btn-group absolute bottom-0 mb-4 ml-0'>
            <label htmlFor='my-modal-3' className='btn'>
              Postpone
            </label>
            <button className='btn btn-active'>Set Complete</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TodoActions;
