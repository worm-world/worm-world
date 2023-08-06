import { open } from '@tauri-apps/api/dialog';
import { readTextFile } from '@tauri-apps/api/fs';
import { getFilteredCrossDesigns, insertCrossDesign } from 'api/crossDesign';
import { type StrainFilter } from 'models/frontend/StrainFilter/StrainFilter';
import CrossDesignCard from 'components/CrossDesignCard/CrossDesignCard';
import { TopNav } from 'components/TopNav/TopNav';
import CrossDesign from 'models/frontend/CrossDesign/CrossDesign';
import { useEffect, useState } from 'react';
import { GiEarthWorm as WormIcon } from 'react-icons/gi';
import { toast } from 'react-toastify';

const Index = (): React.JSX.Element => {
  const [newCrossDesignId, setNewCrossDesignId] = useState<string>();
  const [crossDesigns, setCrossDesigns] = useState<CrossDesign[]>([]);
  const [hasRefreshedOnce, setHasRefreshedOnce] = useState(false);

  const refreshCrossDesigns = async (): Promise<void> => {
    const crossDesigns = await getFilteredCrossDesigns({
      filters: [[['Editable', 'True']]],
      orderBy: [],
    });

    setCrossDesigns(
      crossDesigns.map((crossDesign) => CrossDesign.fromJSON(crossDesign.data))
    );
  };

  useEffect(() => {
    refreshCrossDesigns()
      .then(() => {
        setHasRefreshedOnce(true);
      })
      .catch(console.error);
  }, []);

  const newCrossDesignButton = (
    <button
      key='newCrossDesign'
      className='btn'
      onClick={() => {
        addCrossDesign()
          .then(setNewCrossDesignId)
          .then(refreshCrossDesigns)
          .catch(console.error);
      }}
    >
      New Design
    </button>
  );

  const importCrossDesignButton = (
    <button
      key='importCrossDesign'
      className='btn'
      onClick={() => {
        importCrossDesign().then(refreshCrossDesigns).catch(console.error);
      }}
    >
      Import
    </button>
  );

  return (
    <>
      <TopNav
        title={'Cross Designs'}
        buttons={[newCrossDesignButton, importCrossDesignButton]}
      />
      {hasRefreshedOnce && crossDesigns.length === 0 ? (
        <NoCrossDesignPlaceholder />
      ) : (
        <CrossDesignCards
          crossDesigns={crossDesigns}
          newCrossDesignId={newCrossDesignId}
          setNewCrossDesignId={setNewCrossDesignId}
          refreshCrossDesigns={refreshCrossDesigns}
        />
      )}
    </>
  );
};

const CrossDesignCards = (props: {
  crossDesigns: CrossDesign[];
  newCrossDesignId: string | undefined;
  setNewCrossDesignId: (id: string | undefined) => void;
  refreshCrossDesigns: () => Promise<void>;
}): React.JSX.Element => {
  return (
    <div className='mx-36 my-8 flex flex-wrap '>
      {props.crossDesigns?.map((crossDesign) => {
        const isNew = crossDesign.id === props.newCrossDesignId;
        const crossDesignCard = (
          <CrossDesignCard
            refreshCrossDesigns={() => {
              props.refreshCrossDesigns().catch(console.error);
            }}
            key={crossDesign.id}
            crossDesign={crossDesign}
            isNew={isNew}
          />
        );
        return crossDesignCard;
      })}
    </div>
  );
};

const NoCrossDesignPlaceholder = (): React.JSX.Element => {
  return (
    <div className='m-14 flex flex-col items-center justify-center'>
      <h2 className='text-2xl'>Cross designs can be found here.</h2>
      <h2 className='my-4 flex flex-row text-xl'>
        Click the &quot;new design&quot; button to start.
      </h2>
      <WormIcon className='my-8 text-9xl text-base-300' />
    </div>
  );
};

const importCrossDesign = async (): Promise<void> => {
  try {
    const filepath: string | null = (await open({
      filters: [
        {
          name: 'WormWorld',
          extensions: ['json'],
        },
      ],
    })) as string | null;
    if (filepath === null) return;
    const file = await readTextFile(filepath);
    const clonedCrossDesign = CrossDesign.fromJSON(file).clone();
    await insertCrossDesign(clonedCrossDesign.generateRecord());
    toast.success('Successfully imported crossDesign');
  } catch (err) {
    toast.error(`Error importing crossDesign: ${err}`);
  }
};

const addCrossDesign = async (): Promise<string | undefined> => {
  try {
    const newCrossDesign = new CrossDesign({
      name: '',
      lastSaved: new Date(),
      nodes: [],
      edges: [],
      strainFilters: new Map<string, StrainFilter>(),
      editable: true,
    });
    await insertCrossDesign(newCrossDesign.generateRecord());
    toast.success('Successfully added crossDesign');
    return newCrossDesign.id;
  } catch (err) {
    toast.error(`Error adding crossDesign: ${err}`);
    return undefined;
  }
};

export default Index;
