import CrossNodeModel from 'models/frontend/CrossNode/CrossNode';
import { BiDotsHorizontalRounded as MoreHorizIcon } from 'react-icons/bi';
import { Sex } from 'models/enums';
import { IoMale, IoFemale, IoMaleFemale } from 'react-icons/io5';
import { Allele } from 'models/frontend/Allele/Allele';
import { Genotype, getGenotype } from 'components/CrossNode/genotype/genotype';
import { Chromosome } from 'models/db/filter/db_ChromosomeEnum';

export interface CrossNodeProps {
  model: CrossNodeModel;
}

const getSexIcon = (sex: Sex, className: string): JSX.Element => {
  switch (sex) {
    case Sex.Male:
      return <IoMale className={className} />;
    case Sex.Hermaphrodite:
      return <IoMaleFemale className={className} />;
    case Sex.Female:
      return <IoFemale className={className} />;
  }
};

const CrossNode = (props: CrossNodeProps): JSX.Element => {
  const genotype = getGenotype(props.model);
  return (
    <div
      className={
        'h-28 w-64 rounded bg-base-100 shadow hover:cursor-grab' +
        (props.model.isSelected ? ' border border-primary' : '')
      }
    >
      <div className='flex h-6 justify-between'>
        {getSexIcon(props.model.sex, 'mt-2 ml-1 text-xl')}
        <label htmlFor='right-cross-drawer' className='drawer-button pr-2'>
          <button>
            <MoreHorizIcon />
          </button>
        </label>
      </div>
      <div className='my-2 overflow-x-auto px-3 pb-2'>
        <div
          className='flex min-w-min justify-center text-sm'
          data-testid='crossNodeBody'
        >
          {getChromosomeBoxes(genotype)}
        </div>
      </div>
    </div>
  );
};

// Returns array of chromosome boxes
const getChromosomeBoxes = (genotype: Genotype): JSX.Element[] => {
  const boxes = Array.from(
    new Set([...genotype.genes.keys(), ...genotype.variations.keys()])
  )
    .sort(cmpChromosomes)
    .map((chromosome, idx, arr) => {
      return (
        <div key={idx} className='flex'>
          {getChromosomeBox(chromosome, genotype)}
          <div className='flex flex-col justify-center pt-3 font-light text-base-content'>
            {idx < arr.length - 1 ? <span>;</span> : <span></span>}
          </div>
        </div>
      );
    });
  return boxes;
};

export const cmpChromosomes = (
  chromA?: Chromosome,
  chromB?: Chromosome
): number => {
  if (chromA === undefined) {
    return 1;
  } else if (chromB === undefined) {
    return -1;
  } else {
    const order: Chromosome[] = ['I', 'II', 'III', 'IV', 'V', 'X', 'Ex'];
    const posA = order.indexOf(chromA);
    const posB = order.indexOf(chromB);
    return posA - posB;
  }
};

// All the 'fractions' under a single chromosome
const getChromosomeBox = (
  chromosome: Chromosome | undefined,
  genotype: Genotype
): JSX.Element => {
  const mutationBoxes: JSX.Element[] = [];
  const geneMap = genotype.genes.get(chromosome) ?? new Map();
  const variationMap = genotype.variations.get(chromosome) ?? new Map();
  let nextKey = 0;

  geneMap.forEach((alleles) =>
    mutationBoxes.push(getMutationBox(alleles, nextKey++))
  );
  variationMap.forEach((alleles) => {
    mutationBoxes.push(getMutationBox(alleles, nextKey++));
  });

  const displayChrom = chromosome ?? '?'; // undefined chromosomes are represented by: ?

  return (
    <div key={displayChrom} className='mx-2 my-auto flex flex-col items-center'>
      <div className='font-bold'>{displayChrom}</div>
      <div className='flex flex-row'>{mutationBoxes}</div>
    </div>
  );
};

// One of the 'fractions'
const getMutationBox = (alleles: Allele[], key: number): JSX.Element => {
  if (alleles.length === 1) {
    return <div key={key}>{alleles[0].name}</div>;
  } else {
    return (
      <div key={key} className='flex flex-col'>
        <div className='text-align w-full px-2 text-center'>
          {alleles[0].name}
        </div>
        <div>
          <hr className='border-base-content' />
        </div>
        <div className='text-align w-full px-2 text-center'>
          {alleles[1].name}
        </div>
      </div>
    );
  }
};

export default CrossNode;
