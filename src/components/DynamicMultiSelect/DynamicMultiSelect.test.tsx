import { render, screen } from '@testing-library/react';
import {
  DynamicMultiSelect,
  type DynamicMultiSelectProps,
} from 'components/DynamicMultiSelect/DynamicMultiSelect';
import user from '@testing-library/user-event';
import { type db_Gene } from 'models/db/db_Gene';
import { type GeneFieldName } from 'models/db/filter/db_GeneFieldName';
import { useState } from 'react';
import { Gene } from 'models/frontend/Gene/Gene';

export const mockGetFilteredGenes = async (): Promise<db_Gene[]> => {
  const gene1 = new Gene({ sysName: 'gene1' }).generateRecord();
  const gene2 = new Gene({ sysName: 'gene2' }).generateRecord();
  return await Promise.resolve([gene1, gene2]);
};

const MockDynamicMultiSelect = (): JSX.Element => {
  const [selectedRecords, setSelectedRecords] = useState<Set<db_Gene>>(
    new Set()
  );
  const selectProps: DynamicMultiSelectProps<GeneFieldName, db_Gene> = {
    getFilteredRecordApi: mockGetFilteredGenes,
    searchOn: 'SysName',
    selectInputOn: 'sysName',
    displayResultsOn: ['sysName'],
    selectedRecords,
    setSelectedRecords,
    placeholder: 'testPlaceholder',
    label: 'testLabel',
  };

  return <DynamicMultiSelect {...selectProps} />;
};

const MockDynamicMultiSelectWithFilter = (): JSX.Element => {
  const [selectedRecords, setSelectedRecords] = useState<Set<db_Gene>>(
    new Set()
  );
  const selectProps: DynamicMultiSelectProps<GeneFieldName, db_Gene> = {
    getFilteredRecordApi: mockGetFilteredGenes,
    searchOn: 'SysName',
    selectInputOn: 'sysName',
    displayResultsOn: ['sysName'],
    selectedRecords,
    setSelectedRecords,
    placeholder: 'testPlaceholder',
    label: 'testLabel',
    shouldInclude: (gene: db_Gene) => {
      return gene.sysName === 'gene1';
    },
  };

  return <DynamicMultiSelect {...selectProps} />;
};

describe('DynamicMultiSelect', () => {
  test('renders', () => {
    render(<MockDynamicMultiSelect />);
    expect(screen.getByText(/testLabel/i)).toBeDefined();
    expect(screen.getByRole('textbox')).toBeDefined();
  });

  test('Selects single element', async () => {
    user.setup();

    render(<MockDynamicMultiSelect />);
    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.type(input, 'gene');
    const option = screen.getByText('gene1');
    await user.click(option);
    expect(screen.getByText('gene1')).toBeDefined();
    // Only one selected pill
    expect(screen.getAllByTestId('closeButton')).toHaveLength(1);
  });

  test('Select multiple elements', async () => {
    user.setup();

    render(<MockDynamicMultiSelect />);
    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.type(input, 'gene');
    const option1 = screen.getByText('gene1');
    await user.click(option1);
    expect(screen.getByText('gene1')).toBeDefined();
    expect(screen.getAllByTestId('closeButton')).toHaveLength(1);

    await user.click(input);
    await user.type(input, 'gene');
    const option2 = screen.getByText('gene2');
    await user.click(option2);
    expect(screen.getByText('gene2')).toBeDefined();
    expect(screen.getAllByTestId('closeButton')).toHaveLength(2);
  });

  test('frontend filtering', async () => {
    user.setup();

    render(<MockDynamicMultiSelectWithFilter />);
    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.type(input, 'gene');
    const option1 = screen.getByText('gene1');
    expect(option1).toBeDefined();
    const option2 = screen.queryByText('gene2');
    expect(option2).toBeNull();
  });
});
