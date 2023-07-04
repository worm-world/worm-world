import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import DataImportForm, {
  type FieldType,
} from 'components/DataInputForm/DataInputForm';
import { type db_Allele } from 'models/db/db_Allele';
import { vi } from 'vitest';

describe('DataImportForm ', () => {
  test('successfully renders', () => {
    render(
      <DataImportForm
        title='Empty Form'
        dataName={'Empty Form'}
        fields={[]}
        onSubmit={vi.fn()}
      />
    );

    const form = screen.getByRole('heading', { name: /new/i });
    expect(form).toBeDefined();
  });

  test('submit callback is used', async () => {
    user.setup();
    const onSubmit = vi.fn();

    render(
      <DataImportForm
        title='Empty Form'
        dataName={'Empty Form'}
        fields={[]}
        onSubmit={onSubmit}
      />
    );

    const submitButton = screen.getByRole('button');
    expect(onSubmit).toBeCalledTimes(0);

    await user.click(submitButton);
    expect(onSubmit).toBeCalledTimes(1);
  });

  test('displays form fields', async () => {
    const fields: Array<FieldType<db_Allele>> = [
      {
        name: 'name',
        title: 'Allele Name',
        type: 'text',
      },
      {
        name: 'contents',
        title: 'Allele Contents',
        type: 'text',
      },
      {
        name: 'sysGeneName',
        title: 'Systematic Gene Name',
        type: 'text',
      },
      {
        name: 'variationName',
        title: 'Variation Name',
        type: 'text',
      },
    ];

    render(
      <DataImportForm
        title='Allele Form'
        dataName={'Allele Form'}
        fields={fields}
        onSubmit={vi.fn()}
      />
    );

    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(fields.length);
  });

  test('Input ignores leading and trailing whitespace', async () => {
    user.setup();
    const fields: Array<FieldType<{ string?: string; number?: number }>> = [
      {
        name: 'string',
        title: 'String',
        type: 'text',
      },
      {
        name: 'number',
        title: 'Number',
        type: 'number',
      },
    ];

    let result;
    const onSubmit = (record: { string?: string; number: number }): void => {
      result = record;
    };

    render(
      <DataImportForm
        title='Form'
        dataName={'Form'}
        fields={fields}
        onSubmit={onSubmit}
      />
    );

    await user.click(screen.getByLabelText('String'));
    await user.keyboard(' abc\t');

    await user.click(screen.getByLabelText('Number'));
    await user.keyboard('\t4   ');

    const submit = screen.getByRole('button', { name: /insert/i });
    await user.click(submit);

    expect(result).toEqual({ string: 'abc', number: 4 });
  });
});
