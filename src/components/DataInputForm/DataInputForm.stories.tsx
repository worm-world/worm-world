import { Meta, StoryFn } from '@storybook/react';
import DataImportForm, {
  FieldType,
  DataImportFormProps,
} from 'components/DataInputForm/DataInputForm';
import { db_Allele } from 'models/db/db_Allele';
import { db_Condition } from 'models/db/db_Condition';
import { db_Gene } from 'models/db/db_Gene';
import { db_Phenotype } from 'models/db/db_Phenotype';
import { chromosomes } from 'models/frontend/Chromosome';

export default {
  title: 'Components/DataImportForm',
  component: DataImportForm,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta<typeof DataImportForm>;

const Template =
  <T,>(): StoryFn<DataImportFormProps<T>> =>
  (props) =>
    <DataImportForm {...props} />;

const alleleFields: FieldType<db_Allele>[] = [
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

export const AlleleForm = Template<db_Allele>().bind({});
AlleleForm.args = {
  dataName: 'Allele Form',
  fields: alleleFields,
  onSubmit: (record: db_Allele, onSuccess: () => void) => {
    alert('submitted record');
    onSuccess();
  },
};

const geneFields: FieldType<db_Gene>[] = [
  {
    name: 'sysName',
    title: 'Systematic Name',
    type: 'text',
  },
  {
    name: 'descName',
    title: 'Descriptive Name',
    type: 'text',
  },
  {
    name: 'chromosome',
    title: 'Chromosome Number',
    type: 'select',
    selectOptions: chromosomes,
  },
  {
    name: 'physLoc',
    title: 'Physical Location',
    type: 'number',
  },
  {
    name: 'geneticLoc',
    title: 'Genetic Location',
    type: 'number',
  },
];

export const GeneForm = Template<db_Gene>().bind({});
GeneForm.args = {
  dataName: 'Gene Form',
  fields: geneFields,
  onSubmit: (record: db_Gene, onSuccess: () => void) => {
    alert('submitted record');
    onSuccess();
  },
};

const conditionFields: FieldType<db_Condition>[] = [
  {
    name: 'name',
    title: 'Condition Name',
    type: 'text',
  },
  {
    name: 'description',
    title: 'Description',
    type: 'text',
  },
  {
    name: 'maleMating',
    title: 'Male Mating',
    type: 'number',
  },
  {
    name: 'lethal',
    title: 'Lethal Condition',
    type: 'boolean',
  },
  {
    name: 'femaleSterile',
    title: 'Female Sterile',
    type: 'boolean',
  },
  {
    name: 'arrested',
    title: 'Arrested',
    type: 'boolean',
  },
  {
    name: 'maturationDays',
    title: 'Maturation Days',
    type: 'number',
  },
];

export const ConditionForm = Template<db_Condition>().bind({});
ConditionForm.args = {
  dataName: 'Condition Form',
  fields: conditionFields,
  onSubmit: (record: db_Condition, onSuccess: () => void) => {
    alert('submitted record');
    onSuccess();
  },
};

const phenotypeFields: FieldType<db_Phenotype>[] = [
  {
    name: 'name',
    title: 'Phenotype Name',
    type: 'text',
  },
  {
    name: 'shortName',
    title: 'Short-Name',
    type: 'text',
  },
  {
    name: 'description',
    title: 'Description',
    type: 'text',
  },
  {
    name: 'maleMating',
    title: 'Male Mating',
    type: 'number',
  },
  {
    name: 'maturationDays',
    title: 'Maturation Days',
    type: 'number',
  },
  {
    name: 'wild',
    title: 'Is Wild',
    type: 'boolean',
  },
  {
    name: 'lethal',
    title: 'Lethal',
    type: 'boolean',
  },
  {
    name: 'femaleSterile',
    title: 'Female Sterile',
    type: 'boolean',
  },
  {
    name: 'arrested',
    title: 'Arrested',
    type: 'boolean',
  },
];

export const PhenotypeForm = Template<db_Phenotype>().bind({});
PhenotypeForm.args = {
  dataName: 'Phenotype Form',
  fields: phenotypeFields,
  onSubmit: (record: db_Phenotype, onSuccess: () => void) => {
    alert('submitted record');
    onSuccess();
  },
};

export const EmptyForm = Template<db_Allele>().bind({});
EmptyForm.args = {
  dataName: 'Empty Form',
  fields: [],
  onSubmit: (record: db_Allele, onSuccess: () => void) => {
    alert('submitted');
    onSuccess();
  },
};
