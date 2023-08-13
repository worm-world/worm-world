import BreedCountProbability from 'components/BreedCountProbability/BreedCountProbability';
import EditorContext from 'components/EditorContext/EditorContext';
import { Menu } from 'components/Menu/Menu';
import StrainCardContext from 'components/StrainCardContext/StrainCardContext';
import { Sex } from 'models/enums';
import { type AllelePair } from 'models/frontend/AllelePair/AllelePair';
import { type ChromosomePair } from 'models/frontend/ChromosomePair/ChromosomePair';
import { type Strain } from 'models/frontend/Strain/Strain';
import { useContext } from 'react';
import { BsLightningCharge as MenuIcon } from 'react-icons/bs';
import { IoMale as MaleIcon, IoMaleFemale as HermIcon } from 'react-icons/io5';
import { RiArrowUpDownLine as SwapIcon } from 'react-icons/ri';

interface StrainCardProps {
  strain: Strain;
  id: string;
}

const StrainCard = (props: StrainCardProps): JSX.Element => {
  const probability =
    props.strain.probability === undefined
      ? 'No Prob'
      : `${(props.strain.probability * 100).toFixed(2)}%`;

  const context = useContext(EditorContext);
  const menuItems = context.getMenuItems?.(props.id) ?? [];
  const strainCardContextValue = {
    strain: props.strain,
    toggleHetPair:
      context.toggleHetPair === undefined
        ? undefined
        : (pair: AllelePair) => {
            context.toggleHetPair?.(props.id, pair);
          },
    toggleSex:
      context.toggleSex === undefined
        ? undefined
        : () => {
            context.toggleSex?.(props.id);
          },
    showGenes: context.showGenes,
  };

  return (
    <StrainCardContext.Provider value={strainCardContextValue}>
      <div
        data-testid='strainCard'
        className='flex h-36 w-64 flex-col rounded bg-base-100 shadow-md'
      >
        <div className='flex h-6 justify-between'>
          <SexButton />
          {props.strain.isChild && (
            <div className='dropdown dropdown-top justify-self-center'>
              <label
                tabIndex={0}
                className='btn btn-ghost btn-xs text-accent ring-0 hover:bg-base-200 hover:ring-0'
              >
                {probability}
              </label>
              <div
                tabIndex={0}
                className='card-body dropdown-content rounded-box z-10 m-auto bg-base-100 shadow'
              >
                <BreedCountProbability probability={props.strain.probability} />
              </div>
            </div>
          )}
          <div className={`${menuItems.length === 0 ? 'invisible' : ''}`}>
            <Menu
              title='Actions'
              top={true}
              icon={<MenuIcon />}
              items={menuItems}
            />
          </div>
        </div>
        <div className='overflow-x-auto'>
          <div className='flex h-24 min-w-min justify-center text-sm'>
            <MainContentArea strain={props.strain} />
          </div>
        </div>
        <div className='h-6 text-center font-bold'>{props.strain.name}</div>
      </div>
    </StrainCardContext.Provider>
  );
};

const SexButton = (): React.JSX.Element => {
  const context = useContext(StrainCardContext);
  const buttonIsDisabled =
    context.strain.isParent || context.toggleSex === undefined;
  return (
    <button
      className={`btn btn-ghost btn-xs m-1 text-base ring-0 hover:bg-base-200 hover:ring-0 disabled:bg-transparent 
        disabled:text-base`}
      disabled={buttonIsDisabled}
      onClick={() => {
        if (!context.strain.isParent && context.toggleSex !== undefined) {
          context.toggleSex();
        }
      }}
    >
      {context.strain.sex === Sex.Male && <MaleIcon />}
      {context.strain.sex === Sex.Hermaphrodite && <HermIcon />}
    </button>
  );
};

// Return the main content area of the strain node, which will show genotype information
const MainContentArea = (props: { strain: Strain }): React.JSX.Element => {
  return props.strain.isEmptyWild() ? (
    <div className='flex flex-col items-center justify-center'>(Wild)</div>
  ) : (
    <>
      {Array.from(props.strain.getSortedChromPairs())
        .filter((chromPair) => !(chromPair.isEca() && chromPair.isWild()))
        .map((chromPair, idx, chromPairs) => {
          return (
            <div key={idx} className='flex'>
              <ChromPairBox chromPair={chromPair} />
              <div className='flex flex-col justify-center pt-2 font-light text-base-content'>
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
}): React.JSX.Element => {
  const context = useContext(StrainCardContext);
  const mutationBoxes = props.chromPair.allelePairs.map((allelePair, idx) => {
    const toggleEnabled =
      !context.strain.isParent &&
      !context.strain.isChild &&
      !allelePair.isHomo() &&
      idx !== 0;
    return (
      <MutationBox
        allelePair={allelePair}
        key={idx}
        toggleEnabled={toggleEnabled}
        isX={props.chromPair.isX()}
      />
    );
  });
  const chromName = props.chromPair.getChromName() ?? '?';

  return (
    <div
      key={chromName}
      className='mx-2 flex flex-col items-center justify-start text-lg'
    >
      <div className='font-bold'>{chromName}</div>
      <div className='my-auto flex flex-row'>{mutationBoxes}</div>
    </div>
  );
};

const MutationBox = (props: {
  allelePair: AllelePair;
  toggleEnabled: boolean;
  isX: boolean;
}): React.JSX.Element => {
  const context = useContext(StrainCardContext);

  if (props.allelePair.isEca())
    return props.allelePair.isWild() ? (
      <></>
    ) : (
      <div className='text-align w-full px-2 text-center'>
        {props.allelePair.top.name}
      </div>
    );
  else {
    const hiddenStyling = props.toggleEnabled
      ? `visible group-hover:invisible`
      : '';

    return (
      <div className={`group relative flex flex-col whitespace-nowrap text-lg`}>
        {props.toggleEnabled && (
          <div
            className={`invisible absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primary hover:cursor-pointer group-hover:visible `}
            onClick={() => {
              context.toggleHetPair?.(props.allelePair);
            }}
          >
            <SwapIcon />
          </div>
        )}
        <div className='text-align w-full px-2 text-center'>
          {context.showGenes
            ? props.allelePair.top.getQualifiedName()
            : props.allelePair.top.name}
        </div>
        <hr className={`border-base-content ${hiddenStyling}`} />
        <div className='text-align w-full px-2 text-center'>
          {context.strain.sex === Sex.Male && props.isX
            ? '0'
            : context.showGenes
            ? props.allelePair.bot.getQualifiedName()
            : props.allelePair.bot.name}
        </div>
      </div>
    );
  }
};

export default StrainCard;
