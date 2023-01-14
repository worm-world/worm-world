import React from 'react';
import { toast } from 'react-toastify';

export interface FieldType<T> {
  name: keyof T;
  title: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  selectOptions?: string[];
}

interface iDataImportFormProps<T> {
  className?: string;
  dataName: string;
  fields: Array<FieldType<T>>;
  onSubmitCallback: (arg0: T) => void;
}

interface iFieldsProps<T> {
  fieldList: Array<FieldType<T>>;
}

const Fields = <T,>(props: iFieldsProps<T>): JSX.Element => {
  const fieldList = props.fieldList;
  return (
    <div>
      {fieldList?.map((field: FieldType<T>) => {
        if (field.type === 'boolean') {
          return (
            <div className='form-control my-6' key={'key-' + field.name.toString()}>
              <label className="label cursor-pointer">
                <span className='label-text'>{field.title}</span>
                <input type="checkbox" className="checkbox" name={field.name.toString()} />
              </label>
            </div>
          );
        } else if (field.type === 'select') {
          return (
            <div className='my-6' key={'key-' + field.name.toString()}>
              <label className='label'>
                <span className='label-text'>{field.title}</span>
              </label>
              <select className='select select-bordered w-full max-w-xs'
                key={'key-' + field.name.toString()}
                name={field.name.toString()}              >
                {field.selectOptions?.map((option: string) => {
                  return (
                    <option value={option}>
                      {option}
                    </option>
                  );
                })}
              </select>
            </div>
          );
        } else {
          return (
            <div className='my-6' key={'key-' + field.name.toString()}>
              <label className='label'>
                <span className='label-text'>{field.title}</span>
              </label>
              <input type="text" className='input input-bordered w-full max-w-xs'
                key={'key-' + field.name.toString()}
                name={field.name.toString()} />
            </div>
          );
        }
      })}
    </div>
  );
};

const DataImportForm = <T,>(props: iDataImportFormProps<T>): JSX.Element => {
  const [isFormOpen, setFormOpen] = React.useState(false);
  const handleOpen = (): void => setFormOpen(true);
  const handleClose = (): void => setFormOpen(false);

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
        record[field.name] = datum;
      }
    }
    props.onSubmitCallback(record);
    setFormOpen(false);
  };

  return (
    <div className={props.className}>
      <label htmlFor={'add-new-' + props.dataName} className="btn" onClick={handleOpen}>{'Add New ' + props.dataName}</label>
      <input type="checkbox" id={'add-new-' + props.dataName} className="modal-toggle" hidden={true} />
      <label htmlFor={'add-new-' + props.dataName} className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h2 className='text-center text-3xl'>
            {'New ' + props.dataName}
          </h2>
          <hr className='my-2' />
          <form onSubmit={handleSubmit}>
            <Fields fieldList={props.fields}></Fields>
            <hr className='my-8' />
            <div className='flex flex-row justify-center w-full'>
              <label htmlFor={'add-new-' + props.dataName} className="btn">
                <input
                  type='submit'
                  value="Insert Into Database"
                  onClick={handleClose}
                ></input>
              </label>
            </div>
          </form>
        </label>
      </label>
    </div>
  );
};

export default DataImportForm;
