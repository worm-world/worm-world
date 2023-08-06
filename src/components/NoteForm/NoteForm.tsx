import { useState } from 'react';

export interface NoteFormProps {
  header: string;
  content: string;
  buttonText: string;
  callback: (content: string) => void;
}

const NoteForm = (props: NoteFormProps): React.JSX.Element => {
  const [content, setContent] = useState(props.content);
  return (
    <div className='flex h-5/6 flex-col'>
      <h1 className='text-lg'>{props.header}</h1>
      <div className='mb-2 mt-2 flex h-3/4 flex-col'>
        <textarea
          id='noteContent'
          value={content}
          className='input input-bordered mr-2 h-full w-full resize-none p-2'
          onChange={(event) => {
            setContent(event.target.value);
          }}
        />
      </div>
      <div className='mb-2 mt-4'>
        <button
          className='btn btn-primary w-full'
          onClick={() => {
            props.callback(content);
          }}
        >
          {props.buttonText}
        </button>
      </div>
    </div>
  );
};

export default NoteForm;
