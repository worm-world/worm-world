import React from 'react';
import { CrossNodeModel } from 'models/frontend/CrossNode/CrossNode';
import { Sex } from 'models/enums';
import { IoMale, IoFemale, IoMaleFemale } from 'react-icons/io5';
import { RiArrowUpDownLine as SwapIcon } from 'react-icons/ri';
import { Chromosome } from 'models/db/filter/db_ChromosomeEnum';
import { AllelePair } from 'models/frontend/Strain/AllelePair';
import { Strain } from 'models/frontend/Strain/Strain';
import { Menu } from 'components/Menu/Menu';
import { BsLightningCharge as MenuIcon } from 'react-icons/bs';

const getSexIcon = (
  sex: Sex,
  isParent: boolean,
  toggleSex?: () => void
): JSX.Element => {
  const toggleStyling = 'text-base ' + (isParent ? 'opacity-50' : '');
  return (
    <div
      className={
        'btn-ghost btn-xs btn m-1 ring-0 hover:bg-base-200 hover:ring-0' +
        (isParent ? ' btn-transparent hover:bg-transparent' : '')
      }
      onClick={toggleSex}
    >
      {sex === Sex.Male && <IoMale className={toggleStyling} />}
      {sex === Sex.Hermaphrodite && <IoMaleFemale className={toggleStyling} />}
      {sex === Sex.Female && <IoFemale className={toggleStyling} />}
    </div>
  );
};

export interface iCrossNodeProps {
  model: CrossNodeModel;
}

const CrossNode = (props: iCrossNodeProps): JSX.Element => {
  const menuItems =
    props.model?.getMenuItems !== undefined
      ? props.model.getMenuItems(props.model)
      : [];
  const probability =
    props.model.probability !== undefined && props.model.probability !== null
      ? `${(props.model.probability * 100).toFixed(2)}%`
      : '';
  const canToggleHets = !props.model.isParent && !props.model.isChild;
  return (
    <>
      {props.model !== undefined && (
        <div
          data-testid='crossNode'
          className='hover:cursor-point h-28 w-64 rounded bg-base-100 shadow'
        >
          <div className='flex h-7 justify-between'>
            {getSexIcon(
              props.model.sex,
              props.model.isParent,
              props.model.toggleSex
            )}

            <div className='mt-1 text-accent'>{probability}</div>
            {props.model.getMenuItems !== undefined && (
              <Menu title='Actions' icon={<MenuIcon />} items={menuItems} />
            )}
          </div>
          <div className='my-2 overflow-x-auto px-3 pb-2'>
            <div
              className='flex min-w-min justify-center text-sm'
              data-testid='crossNodeBody'
            >
              {getChromosomeBoxes(
                props.model.strain,
                canToggleHets,
                props.model.toggleHetPair
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Returns array of chromosome boxes
const getChromosomeBoxes = (
  strain: Strain,
  canToggleHets: boolean,
  toggleHetPair?: (pair: AllelePair) => void
): JSX.Element[] => {
  if (strain === undefined) return [];
  return Array.from(strain.chromPairMap.keys())
    .sort(cmpChromosomes)
    .map((chromName, idx, arr) => {
      return (
        <div key={idx} className='flex'>
          {getChromosomeBox(
            canToggleHets,
            chromName,
            strain.chromPairMap.get(chromName),
            toggleHetPair
          )}
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
  canToggleHets: boolean,
  chromName?: Chromosome,
  chromosome?: AllelePair[],
  toggleHetPair?: (pair: AllelePair) => void
): JSX.Element => {
  const mutationBoxes: JSX.Element[] = [];
  let nextKey = 0;
  chromosome?.forEach((allelePair) =>
    mutationBoxes.push(
      getMutationBox(allelePair, nextKey++, canToggleHets, toggleHetPair)
    )
  );

  const displayChrom = chromName ?? '?'; // undefined chromosomes are represented by: ?
  return (
    <div key={displayChrom} className='mx-2 my-auto flex flex-col items-center'>
      <div className='font-bold'>{displayChrom}</div>
      <div className='flex flex-row'>{mutationBoxes}</div>
    </div>
  );
};

const getMutationBox = (
  allelePair: AllelePair,
  key: number,
  canToggleHets: boolean,
  toggleHetPair?: (pair: AllelePair) => void
): JSX.Element => {
  if (allelePair.isECA) {
    if (allelePair.isWild()) return <></>;
    return (
      <div key={key} className='text-align w-full px-2 text-center'>
        {allelePair.getAllele().name}
      </div>
    );
  } else {
    const toggleEnabled =
      allelePair.top.name !== allelePair.bot.name &&
      canToggleHets &&
      toggleHetPair !== undefined;

    const hiddenStyling = toggleEnabled ? `visible group-hover:invisible` : '';
    return (
      <div key={key} className={`group relative flex flex-col`}>
        {toggleEnabled && (
          <div
            className={`invisible absolute top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2 text-primary group-hover:visible `}
            onClick={() => toggleHetPair(allelePair)}
          >
            <SwapIcon />
          </div>
        )}
        <div className='text-align w-full px-2 text-center'>
          {allelePair.top.name}
        </div>
        <div>
          <hr className={`my-1 border-base-content ${hiddenStyling}`} />
        </div>
        <div className='text-align w-full px-2 text-center'>
          {allelePair.bot.name}
        </div>
      </div>
    );
  }
};

export default CrossNode;
