const Spinner = (): JSX.Element => {
  return (
    <div
      role='status'
      className='m-auto mt-10 h-20 w-20 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent'
    />
  );
};

export default Spinner;
