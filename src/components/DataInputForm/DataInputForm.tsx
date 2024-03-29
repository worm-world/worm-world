import { useState } from 'react';
import { toast } from 'react-toastify';

export interface FieldType<T> {
  name: keyof T;
  title: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  selectOptions?: string[];
}

export interface DataImportFormProps<T> {
  className?: string;
  title: string;
  dataName: string;
  fields: Array<FieldType<T>>;
  onSubmit: (arg0: T, successCallback: () => void) => void;
}

interface FieldsProps<T> {
  fieldList: Array<FieldType<T>>;
}

const Fields = <T,>(props: FieldsProps<T>): React.JSX.Element => {
  const fieldList = props.fieldList;
  return (
    <div>
      {fieldList?.map((field: FieldType<T>) => {
        if (field.type === 'boolean') {
          return (
            <div
              className='form-control my-1'
              key={'key-' + field.name.toString()}
            >
              <label className='label cursor-pointer'>
                <span className='label-text'>{field.title}</span>
                <input
                  type='checkbox'
                  className='checkbox'
                  name={field.name.toString()}
                />
              </label>
            </div>
          );
        } else if (field.type === 'select') {
          const key = 'key-' + field.name.toString();
          return (
            <div className='my-1' key={key}>
              <label className='label'>
                <span className='label-text'>{field.title}</span>
                <select
                  className='select select-bordered w-full max-w-xs'
                  key={key}
                  name={field.name.toString()}
                >
                  {field.selectOptions?.map((option: string) => {
                    return (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    );
                  })}
                </select>
              </label>
            </div>
          );
        } else {
          return (
            <div className='my-1' key={'key-' + field.name.toString()}>
              <label className='label'>
                <span className='label-text'>{field.title}</span>
                <input
                  type='text'
                  className='input input-bordered w-full max-w-xs'
                  key={'key-' + field.name.toString()}
                  name={field.name.toString()}
                />
              </label>
            </div>
          );
        }
      })}
    </div>
  );
};

const DataImportForm = <T,>(
  props: DataImportFormProps<T>
): React.JSX.Element => {
  const [isFormOpen, setFormOpen] = useState(false);

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const record: any = {};
    for (const field of props.fields) {
      const datum = data.get(field.name.toString());
      let boolValue: boolean = false;
      if (field.type === 'boolean') {
        if (datum === 'on') {
          boolValue = true;
        }
        record[field.name] = boolValue;
      } else if (field.type === 'number' && datum != null && datum !== '') {
        if (Number.isNaN(+datum)) {
          toast(
            `Please enter a valid number for the field:  + ${String(
              field.name
            )}`
          );
          return;
        }
        record[field.name] = +datum;
      } else {
        if (datum === '' || datum === null) {
          record[field.name] = null;
        } else {
          record[field.name] = datum.toString().trim();
        }
      }
    }
    props.onSubmit(record, () => {
      setFormOpen(false);
    });
  };

  return (
    <div className={props.className}>
      <label
        htmlFor={'add-new-' + props.dataName}
        className='btn'
        onClick={() => {
          setFormOpen(true);
        }}
      >
        {'Add New ' + props.title.slice(0, -1)}
      </label>
      <input
        type='checkbox'
        id={'add-new-' + props.dataName}
        className='modal-toggle'
        readOnly
        checked={isFormOpen}
      />
      <div className='modal cursor-pointer'>
        <div
          className='absolute h-full w-full'
          onClick={() => {
            setFormOpen(false);
          }}
        />
        <div className='modal-box relative'>
          <h2 className='text-center text-3xl'>{'New ' + props.title}</h2>
          <hr className='my-2' />
          <form onSubmit={handleSubmit}>
            <Fields fieldList={props.fields}></Fields>
            <hr className='my-8' />
            <div className='flex w-full flex-row justify-center'>
              <input
                className='btn'
                type='submit'
                value='Insert Into Database'
              ></input>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DataImportForm;
