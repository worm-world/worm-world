import BreedCountProbability from 'components/BreedCountProbability/BreedCountProbability';
import { ShowGenesContext } from 'components/Editor/Editor';
import { Menu } from 'components/Menu/Menu';
import { Sex } from 'models/enums';
import { type AllelePair } from 'models/frontend/AllelePair/AllelePair';
import { type ChromosomePair } from 'models/frontend/ChromosomePair/ChromosomePair';
import { type Strain } from 'models/frontend/Strain/Strain';
import { type StrainNodeModel } from 'models/frontend/StrainNodeModel/StrainNodeModel';
import { useContext } from 'react';
import { BsLightningCharge as MenuIcon } from 'react-icons/bs';
import { IoFemale, IoMale, IoMaleFemale } from 'react-icons/io5';
import { RiArrowUpDownLine as SwapIcon } from 'react-icons/ri';

export const STRAIN_NODE_WIDTH = 256; // w-64
export const STRAIN_NODE_HEIGHT = 144; // w-36

const SexIcon = (props: {
  sex: Sex;
  isParent: boolean;
  toggleSex?: () => void;
}): JSX.Element => {
  const toggleStyling = 'text-base ' + (props.isParent ? 'opacity-50' : '');
  return (
    <div
      className={
        'btn-ghost btn-xs btn m-1 ring-0 hover:bg-base-200 hover:ring-0' +
        (props.isParent ? ' btn-transparent hover:bg-transparent' : '')
      }
      onClick={props.toggleSex}
    >
      {props.sex === Sex.Male && <IoMale className={toggleStyling} />}
      {props.sex === Sex.Hermaphrodite && (
        <IoMaleFemale className={toggleStyling} />
      )}
      {props.sex === Sex.Female && <IoFemale className={toggleStyling} />}
    </div>
  );
};

export interface StrainNodeProps {
  model: StrainNodeModel;
}

const StrainNode = (props: StrainNodeProps): JSX.Element => {
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
          data-testid='strainNode'
          className='flex h-36 w-64 flex-col rounded bg-base-100 shadow'
        >
          <div className='flex h-6 justify-between'>
            <SexIcon
              sex={props.model.sex}
              isParent={props.model.isParent}
              toggleSex={props.model.toggleSex}
            />
            {props.model.isChild && (
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
                    <BreedCountProbability
                      probability={props.model.probability}
                    />
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
              <MainContentArea
                strain={props.model.strain}
                canToggleHets={canToggleHets}
                toggleHetPair={props.model.toggleHetPair}
              />
            </div>
          </div>
          <div className='h-6 text-center text-sm font-bold'>
            {props.model.strain.name}
          </div>
        </div>
      )}
    </>
  );
};

// Return the main content area of the strain node, which will show genotype information
const MainContentArea = (props: {
  strain: Strain;
  canToggleHets: boolean;
  toggleHetPair?: (pair: AllelePair) => void;
}): JSX.Element => {
  if (props.strain.getAllelePairs().length === 0) {
    return <div className='flex h-12 flex-col justify-center'>(Wild)</div>;
  } else {
    return (
      <ChromBoxes
        strain={props.strain}
        canToggleHets={props.canToggleHets}
        toggleHetPair={props.toggleHetPair}
      />
    );
  }
};

// Returns array of chromosome boxes
const ChromBoxes = (props: {
  strain: Strain;
  canToggleHets: boolean;
  toggleHetPair?: (pair: AllelePair) => void;
}): JSX.Element => {
  let hideEcaBox = false;
  if (props.strain.chromPairMap.has('Ex')) {
    const nonWildEcas = props.strain.chromPairMap.get('Ex');
    hideEcaBox = nonWildEcas?.allelePairs.length === 0;
  }
  const lastIndex = hideEcaBox
    ? props.strain.chromPairMap.size - 2
    : props.strain.chromPairMap.size - 1;

  return (
    <>
      {Array.from(props.strain.getSortedChromPairs()).map((chromPair, idx) => {
        if (chromPair.isEca() && hideEcaBox) return <></>;
        return (
          <div key={idx} className='flex'>
            <ChromBox
              canToggleHets={props.canToggleHets}
              chromPair={chromPair}
              toggleHetPair={props.toggleHetPair}
            />
            <div className='flex flex-col justify-center pt-3 font-light text-base-content'>
              {idx < lastIndex ? ';' : ''}
            </div>
          </div>
        );
      })}
    </>
  );
};

// All the 'fractions' under a single chromosome
const ChromBox = (props: {
  canToggleHets: boolean;
  chromPair?: ChromosomePair;
  toggleHetPair?: (pair: AllelePair) => void;
}): JSX.Element => {
  const mutationBoxes = props.chromPair?.allelePairs.map((allelePair, idx) => (
    <MutationBox
      allelePair={allelePair}
      key={idx}
      canToggleHets={props.canToggleHets}
      toggleHetPair={props.toggleHetPair}
    />
  ));
  const chromName = props.chromPair?.getChromName() ?? '?';

  return (
    <div key={chromName} className='mx-2  flex flex-col items-center'>
      <div className='font-bold'>{chromName}</div>
      <div className='my-auto flex flex-row'>{mutationBoxes}</div>
    </div>
  );
};

const MutationBox = (props: {
  allelePair: AllelePair;
  canToggleHets: boolean;
  toggleHetPair?: (pair: AllelePair) => void;
}): JSX.Element => {
  if (props.allelePair.isEca()) {
    if (props.allelePair.isWild()) return <></>;
    return (
      <div className='text-align w-full px-2 text-center'>
        {props.allelePair.top.name}
      </div>
    );
  } else {
    const toggleEnabled =
      props.allelePair.top.name !== props.allelePair.bot.name &&
      props.canToggleHets &&
      props.toggleHetPair !== undefined;

    const hiddenStyling = toggleEnabled ? `visible group-hover:invisible` : '';
    const showGene = useContext(ShowGenesContext);
    return (
      <div className={`group relative flex flex-col whitespace-nowrap`}>
        {toggleEnabled && (
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
          {showGene
            ? props.allelePair.bot.getQualifiedName()
            : props.allelePair.bot.name}
        </div>
      </div>
    );
  }
};

export default StrainNode;
