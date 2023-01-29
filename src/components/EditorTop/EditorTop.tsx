export interface EditorTopProps {
  name: string;
  buttons?: JSX.Element[];
}

const EditorTop = (props: EditorTopProps): JSX.Element => {
  return (
    <div className='flex flex-row justify-between border-b-4 border-b-base-300 bg-base-200 pt-4 pb-4'>
      <h1 className='pl-24 text-3xl text-base-content'>{props.name}</h1>
      <div className='flex flex-row justify-end pl-10'>{props.buttons}</div>
    </div>
  );
};

export default EditorTop;