export interface NoteFormProps {
  content: string;
  setContent: (newContent: string) => void;
  callback: () => void;
  header: string;
  buttonText: string;
}

const NoteForm = (props: NoteFormProps): JSX.Element => {
  return (
    <div className='flex h-5/6 flex-col'>
      <h1 className='text-lg'>{props.header}</h1>
      <div className='mb-2 mt-2 flex h-3/4 flex-col'>
        <textarea
          value={props.content}
          onChange={(e) => props.setContent(e.target.value)}
          id='noteContent'
          className='input-bordered input mr-2 h-full w-full resize-none p-2'
        />
      </div>
      <div className='mb-2 mt-4'>
        <button
          className='btn-primary btn w-full'
          onClick={() => {
            props.callback();
          }}
        >
          {props.buttonText}
        </button>
      </div>
    </div>
  );
};

export default NoteForm;
