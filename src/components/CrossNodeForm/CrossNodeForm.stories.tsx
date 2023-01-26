import { StoryFn, Meta } from '@storybook/react';
import CrossNodeForm, { CrossNodeFormProps } from './CrossNodeForm';
import CrossNode from 'models/frontend/CrossNode/CrossNode';
import { Filter } from 'models/db/filter/Filter';
import { GeneFieldName } from 'models/db/filter/db_GeneFieldName';
import { db_Gene } from 'models/db/db_Gene';
import * as mockGenes from 'models/frontend/Gene/Gene.mock';
import { VariationFieldName } from 'models/db/filter/db_VariationFieldName';
import { db_VariationInfo } from 'models/db/db_VariationInfo';
import * as mockVariations from 'models/frontend/VariationInfo/VariationInfo.mock';
import { AlleleFieldName } from 'models/db/filter/db_AlleleFieldName';
import { db_Allele } from 'models/db/db_Allele';
import * as mockAlleles from 'models/frontend/Allele/Allele.mock';
import { Allele } from 'models/frontend/Allele/Allele';
import { Gene } from 'models/frontend/Gene/Gene';
import { VariationInfo } from 'models/frontend/VariationInfo/VariationInfo';

const mockGetFilteredGenes = (
  filter: Filter<GeneFieldName>
): Promise<db_Gene[]> => {
  const genes = [
    mockGenes.dpy10,
    mockGenes.kin4,
    mockGenes.lin15B,
    mockGenes.unc119,
    mockGenes.unc18,
  ];
  const expr = filter.filters.at(0)?.at(0)?.at(1) as { Like: string };

  // We only search genes on sysName
  const matches: db_Gene[] = [];
  genes.forEach((gene) => {
    if (gene.sysName.toLowerCase().includes(expr.Like.toLowerCase())) {
      matches.push(gene.generateRecord());
    }
  });
  return Promise.resolve(matches);
};

const mockGetFilteredVariations = (
  filter: Filter<VariationFieldName>
): Promise<db_VariationInfo[]> => {
  const variations = [
    mockVariations.oxEx219999,
    mockVariations.oxEx2254,
    mockVariations.oxIs12,
    mockVariations.oxIs644,
    mockVariations.oxSi1168,
    mockVariations.oxTi302,
    mockVariations.oxTi75,
    mockVariations.tmC5,
  ];
  const expr = filter.filters.at(0)?.at(0)?.at(1) as { Like: string };
  // We only search genes on sysName
  const matches: db_VariationInfo[] = [];
  variations.forEach((variation) => {
    if (variation.name.toLowerCase().includes(expr.Like.toLowerCase())) {
      matches.push(variation.generateRecord());
    }
  });
  return Promise.resolve(matches);
};

const alleles = [
  mockAlleles.cn64,
  mockAlleles.ed3,
  mockAlleles.md299,
  mockAlleles.n765,
  mockAlleles.ox1059,
  mockAlleles.oxEx219999,
  mockAlleles.oxEx2254,
  mockAlleles.oxIs12,
  mockAlleles.oxIs644,
  mockAlleles.oxSi1168,
  mockAlleles.oxTi302,
  mockAlleles.oxTi75,
  mockAlleles.tmC5,
];

const mockGetFilteredAlleles = (
  filter: Filter<AlleleFieldName>
): Promise<db_Allele[]> => {
  const matches: db_Allele[] = [];

  const expr = filter.filters.at(0)?.at(0)?.at(1) as { Like: string };
  alleles.forEach((allele) => {
    if (allele.name.toLowerCase().includes(expr.Like.toLowerCase())) {
      matches.push(allele.generateRecord());
    }
  });
  return Promise.resolve(matches);
};

const mockAlleleCreateFromRecord = (dbAllele: db_Allele): Promise<Allele> => {
  const allele: Allele = new Allele({
    name: dbAllele.name,
    gene: dbAllele.sysGeneName
      ? new Gene({ sysName: dbAllele.sysGeneName })
      : undefined,
    variation: dbAllele.variationName
      ? new VariationInfo({ name: dbAllele.variationName })
      : undefined,
  });
  return Promise.resolve(allele);
};
const addNewCrossNode = (crossNode: CrossNode): void => {
  alert('Would add new node \n' + JSON.stringify(crossNode, null, 2));
};

export default {
  title: 'Components/CrossNodeForm',
  component: CrossNodeForm,
} as Meta<typeof CrossNodeForm>;

const Template: StoryFn<typeof CrossNodeForm> = (args: CrossNodeFormProps) => {
  return (
    <div className='flex justify-between'>
      <div>
        <CrossNodeForm
          addNewCrossNode={addNewCrossNode}
          getFilteredAlleles={mockGetFilteredAlleles}
          createAlleleFromRecord={mockAlleleCreateFromRecord}
        />
      </div>
      <div className='flex h-4/5 flex-col bg-yellow-100 p-3 shadow-lg'>
        <h1 className='text-lg'>For reference</h1>
        {alleles.map((allele) => (
          <div>{`Allele ${allele.name} on ${
            allele.gene ? 'gene '.concat(allele.gene.sysName) : ''
          } ${
            allele.variation ? 'variation '.concat(allele.variation.name) : ''
          }`}</div>
        ))}
      </div>
    </div>
  );
};

export const primary = Template.bind({});
