import BreedCountProbability from 'components/BreedCountProbability/BreedCountProbability';
import { ShowGenesContext } from 'components/Editor/Editor';
import { Menu } from 'components/Menu/Menu';
import { Sex } from 'models/enums';
import { type AllelePair } from 'models/frontend/AllelePair/AllelePair';
import { type ChromosomePair } from 'models/frontend/ChromosomePair/ChromosomePair';
import { type Strain } from 'models/frontend/Strain/Strain';
import { type StrainData } from 'models/frontend/StrainData/StrainData';
import { createContext, useContext } from 'react';
import { BsLightningCharge as MenuIcon } from 'react-icons/bs';
import { IoMale as MaleIcon, IoMaleFemale as HermIcon } from 'react-icons/io5';
import { RiArrowUpDownLine as SwapIcon } from 'react-icons/ri';

export const STRAIN_NODE_WIDTH = 256; // w-64
export const STRAIN_NODE_HEIGHT = 144; // w-36
const StrainIsFrozenContext = createContext<boolean>(false);
const ToggleHetPairContext = createContext<
  ((allelePair: AllelePair) => void) | undefined
>(() => {});
const SexContext = createContext<Sex>(Sex.Hermaphrodite);

export interface StrainNodeProps {
  data: StrainData;
}

const StrainNode = (props: StrainNodeProps): React.JSX.Element => {
  const menuItems =
    props.data?.getMenuItems !== undefined
      ? props.data.getMenuItems(props.data)
      : [];
  const probability =
    props.data.probability !== undefined && props.data.probability !== null
      ? `${(props.data.probability * 100).toFixed(2)}%`
      : '';
  return (
    <>
      <div
        data-testid='strainNode'
        className='flex h-36 w-64 flex-col rounded bg-base-100 shadow'
      >
        <div className='flex h-6 justify-between'>
          <SexButton
            sex={props.data.strain.sex}
            isParent={props.data.isParent}
            toggleSex={props.data.toggleSex}
          />
          {props.data.isChild && (
            <div className='dropdown-top dropdown'>
              <label
                tabIndex={0}
                className='btn-ghost btn-xs btn text-accent ring-0 hover:bg-base-200 hover:ring-0'
              >
                {probability}
              </label>
              <div
                tabIndex={0}
                className='compact card dropdown-content rounded-box w-full bg-base-100 shadow'
              >
                <div className='card-body'>
                  <BreedCountProbability probability={props.data.probability} />
                </div>
              </div>
            </div>
          )}
          {menuItems.length > 0 && (
            <Menu
              title='Actions'
              top={true}
              icon={<MenuIcon />}
              items={menuItems}
            />
          )}
        </div>
        <div className='overflow-x-auto'>
          <div
            className='flex h-24 min-w-min justify-center text-sm'
            data-testid='strainNodeBody'
          >
            <StrainIsFrozenContext.Provider
              value={props.data.isParent || props.data.isChild}
            >
              <ToggleHetPairContext.Provider value={props.data.toggleHetPair}>
                <SexContext.Provider value={props.data.strain.sex}>
                  <MainContentArea strain={props.data.strain} />
                </SexContext.Provider>
              </ToggleHetPairContext.Provider>
            </StrainIsFrozenContext.Provider>
          </div>
        </div>
        <div className='h-6 text-center text-sm font-bold'>
          {props.data.strain.name}
        </div>
      </div>
    </>
  );
};

const SexButton = (props: {
  sex: Sex;
  isParent: boolean;
  toggleSex?: () => void;
}): React.JSX.Element => {
  const toggleStyling = 'text-base ' + (props.isParent ? 'opacity-50' : '');
  return (
    <button
      className={
        'btn-ghost btn-xs btn m-1 ring-0 hover:bg-base-200 hover:ring-0' +
        (props.isParent ? ' btn-transparent hover:bg-transparent' : '')
      }
      onClick={() => {
        if (!props.isParent) props.toggleSex?.();
      }}
    >
      {props.sex === Sex.Male && <MaleIcon className={toggleStyling} />}
      {props.sex === Sex.Hermaphrodite && (
        <HermIcon className={toggleStyling} />
      )}
    </button>
  );
};

// Return the main content area of the strain node, which will show genotype information
const MainContentArea = (props: { strain: Strain }): React.JSX.Element => {
  return props.strain.isEmptyWild() ? (
    <div className='flex h-12 flex-col justify-center'>(Wild)</div>
  ) : (
    <>
      {Array.from(props.strain.getSortedChromPairs())
        .filter((chromPair) => !(chromPair.isEca() && chromPair.isWild()))
        .map((chromPair, idx, chromPairs) => {
          return (
            <div key={idx} className='flex'>
              <ChromPairBox chromPair={chromPair} />
              <div className='flex flex-col justify-center pt-3 font-light text-base-content'>
                {idx < chromPairs.length - 1 ? ';' : ''}
              </div>
            </div>
          );
        })}
    </>
  );
};

// All the 'fractions' under a single chromosome
const ChromPairBox = (props: {
  chromPair: ChromosomePair;
  toggleHetPair?: (pair: AllelePair) => void;
}): React.JSX.Element => {
  const strainIsFrozen = useContext(StrainIsFrozenContext);
  const toggleHetPair = useContext(ToggleHetPairContext);
  const mutationBoxes = props.chromPair.allelePairs.map((allelePair, idx) => {
    const toggleEnabled =
      !strainIsFrozen &&
      !allelePair.isHomo() &&
      idx !== 0 &&
      toggleHetPair !== undefined;
    return (
      <MutationBox
        allelePair={allelePair}
        key={idx}
        toggleHetPair={toggleEnabled ? toggleHetPair : undefined}
        isX={props.chromPair.isX()}
      />
    );
  });
  const chromName = props.chromPair.getChromName() ?? '?';

  return (
    <div key={chromName} className='mx-2  flex flex-col items-center'>
      <div className='font-bold'>{chromName}</div>
      <div className='my-auto flex flex-row'>{mutationBoxes}</div>
    </div>
  );
};

const MutationBox = (props: {
  allelePair: AllelePair;
  toggleHetPair?: (allelePair: AllelePair) => void;
  isX: boolean;
}): React.JSX.Element => {
  const showGene = useContext(ShowGenesContext);
  const sex = useContext(SexContext);

  if (props.allelePair.isEca())
    return props.allelePair.isWild() ? (
      <></>
    ) : (
      <div className='text-align w-full px-2 text-center'>
        {props.allelePair.top.name}
      </div>
    );
  else {
    const canToggleHets = props.toggleHetPair !== undefined;
    const hiddenStyling = canToggleHets ? `visible group-hover:invisible` : '';

    return (
      <div className={`group relative flex flex-col whitespace-nowrap`}>
        {canToggleHets && (
          <div
            className={`invisible absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primary hover:cursor-pointer group-hover:visible `}
            onClick={() => {
              props.toggleHetPair?.(props.allelePair);
            }}
          >
            <SwapIcon />
          </div>
        )}
        <div className='text-align w-full px-2 text-center'>
          {showGene
            ? props.allelePair.top.getQualifiedName()
            : props.allelePair.top.name}
        </div>
        <div>
          <hr className={`my-1 border-base-content ${hiddenStyling}`} />
        </div>
        <div className='text-align w-full px-2 text-center'>
          {sex === Sex.Male && props.isX
            ? '0'
            : showGene
            ? props.allelePair.bot.getQualifiedName()
            : props.allelePair.bot.name}
        </div>
      </div>
    );
  }
};

export default StrainNode;
