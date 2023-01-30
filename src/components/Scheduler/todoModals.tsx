const TodoModals = (props: {}): JSX.Element => {
  return (
    <>
      <input type='checkbox' id='conditions' className='modal-toggle' />
      <div className='modal'>
        <div className='modal-box relative'>
          <label
            htmlFor='conditions'
            className='btn btn-sm btn-circle absolute right-2 top-2'
          >
            ✕
          </label>
          Plate Temp: 40C
          <br></br>
          Drug Coating: Asprin
        </div>
      </div>
      <input type='checkbox' id='my-modal-3' className='modal-toggle' />
      <div className='modal'>
        <div className='modal-box relative h-32'>
          <label
            htmlFor='my-modal-3'
            className='btn btn-sm btn-circle absolute right-2 top-2'
          >
            ✕
          </label>
          <label htmlFor='start'>Postpone To: </label>
          <input type='date' id='start' name='trip-start' value=''></input>
          <br></br>
          Warning: Postponing this task will alter the due dates of future tasks
          and may add additional steps
        </div>
      </div>
    </>
  );
};

export default TodoModals;
