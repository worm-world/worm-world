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
import styles from './DataImportForm.module.css';

export interface FieldType<T> {
  name: keyof T;
  title: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  selectOptions?: string[];
}

interface iDataImportFormProps<T> {
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
            <div
              key={'key-' + field.name.toString()}
              className={styles['form-checkbox-container']}
            >
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
            <div
              key={'key-' + field.name.toString()}
              className={styles['form-text-container']}
            >
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
            <div
              key={'key-' + field.name.toString()}
              className={styles['form-text-container']}
            >
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
      <button type='submit'>Insert Into Database</button>
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
    <div>
      <button onClick={handleOpen}>{'Add New ' + props.dataName}</button>
      <Modal open={isFormOpen} onClose={handleClose}>
        <div className={styles['modal-container']}>
          <Card>
            <div className={styles['modal-form-container']}>
              <Typography className={styles['modal-form-title']} variant='h4'>
                {'Add New ' + props.dataName}
              </Typography>
              <form className={styles['modal-box']} onSubmit={handleSubmit}>
                <Fields fieldList={props.fields}></Fields>
              </form>
            </div>
          </Card>
        </div>
      </Modal>
    </div>
  );
};

export default DataImportForm;
