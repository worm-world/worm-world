import React from 'react';
import { CrossNodeModel } from 'models/frontend/CrossNode/CrossNode';
import { Sex } from 'models/enums';
import { IoMale, IoFemale, IoMaleFemale } from 'react-icons/io5';
import { Chromosome } from 'models/db/filter/db_ChromosomeEnum';
import { AllelePair } from 'models/frontend/Strain/AllelePair';
import { Strain } from 'models/frontend/Strain/Strain';
import { CrossNodeMenu } from 'components/CrossNodeMenu/CrossNodeMenu';

const getSexIcon = (sex: Sex, toggleSex?: () => void): JSX.Element => {
  switch (sex) {
    case Sex.Male:
      return <IoMale onClick={toggleSex} />;
    case Sex.Hermaphrodite:
      return <IoMaleFemale onClick={toggleSex} />;
    case Sex.Female:
      return <IoFemale onClick={toggleSex} />;
  }
};

export interface iCrossNodeProps {
  model: CrossNodeModel;
}

const CrossNode = (props: iCrossNodeProps): JSX.Element => {
  const menuItems =
    props.model?.getMenuItems !== undefined
      ? props.model.getMenuItems(props.model)
      : [];
  return (
    <>
      {props.model !== undefined && (
        <div
          data-testid='crossNode'
          className='h-28 w-64 rounded bg-base-100 shadow hover:cursor-grab'
        >
          <div className='flex h-6 justify-between'>
            <div className=' btn-ghost btn-xs btn m-1 text-xl'>
              {getSexIcon(props.model.sex, props.model.toggleSex)}
            </div>
            {props.model.getMenuItems !== undefined && (
              <CrossNodeMenu items={menuItems} />
            )}
          </div>
          <div className='my-2 overflow-x-auto px-3 pb-2'>
            <div
              className='flex min-w-min justify-center text-sm'
              data-testid='crossNodeBody'
            >
              {getChromosomeBoxes(props.model.strain)}
            </div>
          </div>
        </div>
      )}
    </>
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
