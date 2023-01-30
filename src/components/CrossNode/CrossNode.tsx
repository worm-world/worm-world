import React from 'react';
import { CrossNodeModel } from 'models/frontend/CrossNode/CrossNode';
import { Sex } from 'models/enums';
import { IoMale, IoFemale, IoMaleFemale } from 'react-icons/io5';
import { Chromosome } from 'models/db/filter/db_ChromosomeEnum';
import { AllelePair } from 'models/frontend/Strain/AllelePair';
import { Strain } from 'models/frontend/Strain/Strain';
import { CrossNodeMenu } from 'components/CrossNodeMenu/CrossNodeMenu';

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

const CrossNode = (props: CrossNodeModel): JSX.Element => {
  const menuItems =
    props.getMenuItems !== undefined ? props.getMenuItems(props) : [];
  return (
    <div
      data-testid='crossNode'
      className='h-28 w-64 rounded bg-base-100 shadow hover:cursor-grab'
    >
      <div className='flex h-6 justify-between'>
        {getSexIcon(props.sex, 'mt-2 ml-1 text-xl')}
        <CrossNodeMenu items={menuItems} />
      </div>
      <div className='my-2 overflow-x-auto px-3 pb-2'>
        <div
          className='flex min-w-min justify-center text-sm'
          data-testid='crossNodeBody'
        >
          {getChromosomeBoxes(props.strain)}
        </div>
      </div>
    </div>
  );
};

// Returns array of chromosome boxes
const getChromosomeBoxes = (strain: Strain): JSX.Element[] => {
  return Array.from(strain.chromPairMap.keys())
    .sort(cmpChromosomes)
    .map((chromosome, idx, arr) => {
      return (
        <div key={idx} className='flex'>
          {getChromosomeBox(chromosome, strain.chromPairMap.get(chromosome))}
          <div className='flex flex-col justify-center pt-3 font-light text-base-content'>
            {idx < arr.length - 1 ? <span>;</span> : <span></span>}
          </div>
        </div>
      );
    });
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
  chromName: Chromosome | undefined,
  chromosome?: AllelePair[]
): JSX.Element => {
  const mutationBoxes: JSX.Element[] = [];
  let nextKey = 0;
  chromosome?.forEach((allelePair) =>
    mutationBoxes.push(getMutationBox(allelePair, nextKey++))
  );

  const displayChrom = chromName ?? '?'; // undefined chromosomes are represented by: ?
  return (
    <div key={displayChrom} className='mx-2 my-auto flex flex-col items-center'>
      <div className='font-bold'>{displayChrom}</div>
      <div className='flex flex-row'>{mutationBoxes}</div>
    </div>
  );
};

const getMutationBox = (allelePair: AllelePair, key: number): JSX.Element => {
  if (allelePair.isECA) {
    return <div key={key}>{allelePair.top.name}</div>;
  } else {
    return (
      <div key={key} className='flex flex-col'>
        <div className='text-align w-full px-2 text-center'>
          {allelePair.top.name}
        </div>
        <div>
          <hr className='border-base-content' />
        </div>
        <div className='text-align w-full px-2 text-center'>
          {allelePair.bot.name}
        </div>
      </div>
    );
  }
};

export default CrossNode;
