import {
  Card,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import Modal from '@mui/material/Modal';
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
            <div className='my-6' key={'key-' + field.name.toString()}>
              <FormControlLabel
                key={'key-' + field.name.toString()}
                name={field.name.toString()}
                control={<Checkbox />}
                label={field.title}
              />
            </div>
          );
        } else if (field.type === 'select') {
          return (
            <div className='my-6' key={'key-' + field.name.toString()}>
              <InputLabel id={field.name.toString()}>{field.title}</InputLabel>
              <Select
                labelId={field.name.toString()}
                label={'Test'}
                key={'key-' + field.name.toString()}
                name={field.name.toString()}
              >
                {field.selectOptions?.map((option: string) => {
                  return (
                    <MenuItem key={'key-' + option} value={option}>
                      {option}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
          );
        } else {
          return (
            <div className='my-6' key={'key-' + field.name.toString()}>
              <TextField
                type={'text'}
                label={field.title}
                key={'key-' + field.name.toString()}
                name={field.name.toString()}
              >
                {field.title}
              </TextField>
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
      <button onClick={handleOpen}>{'Add New ' + props.dataName}</button>
      <Modal open={isFormOpen} onClose={handleClose}>
        <div>
          <Card className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-10 px-20'>
            <div>
              <Typography variant='h4' className='text-center'>
                {'New ' + props.dataName}
              </Typography>
              <hr className='my-2' />
              <form onSubmit={handleSubmit}>
                <Fields fieldList={props.fields}></Fields>
                <hr className='my-8' />
                <div className='flex flex-row justify-center w-full'>
                  <button
                    type='submit'
                    className='bg-zinc-100 hover:bg-zinc-200 p-2 transition-all shadow-sm'
                  >
                    Insert Into Database
                  </button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      </Modal>
    </div>
  );
};

export default DataImportForm;
