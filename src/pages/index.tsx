import { open } from '@tauri-apps/api/dialog';
import { readTextFile } from '@tauri-apps/api/fs';
import { getFilteredTrees, insertTree } from 'api/tree';
import { type OffspringFilter } from 'components/OffspringFilter/OffspringFilter';
import TreeCard from 'components/TreeCard/TreeCard';
import { TopNav } from 'components/TopNav/TopNav';
import CrossTree from 'models/frontend/CrossTree/CrossTree';
import { useEffect, useState } from 'react';
import { GiEarthWorm as WormIcon } from 'react-icons/gi';
import { toast } from 'react-toastify';

const Index = (): React.JSX.Element => {
  const [newTreeId, setNewTreeId] = useState<string>();
  const [trees, setTrees] = useState<CrossTree[]>([]);
  const [hasRefreshedOnce, setHasRefreshedOnce] = useState(false);

  const refreshTrees = async (): Promise<void> => {
    const trees = await getFilteredTrees({
      filters: [[['Editable', 'True']]],
      orderBy: [],
    });

    setTrees(trees.map((tree) => CrossTree.fromJSON(tree.data)));
  };

  // if (newTreeId !== undefined) setNewTreeId(undefined);

  useEffect(() => {
    refreshTrees()
      .then(() => {
        setHasRefreshedOnce(true);
      })
      .catch(console.error);
  }, []);

  const newTreeButton = (
    <button
      key='newTree'
      className='btn'
      onClick={() => {
        addTree().then(setNewTreeId).then(refreshTrees).catch(console.error);
      }}
    >
      New Design
    </button>
  );

  const importTreeButton = (
    <button
      key='importTree'
      className='btn'
      onClick={() => {
        importTree().then(refreshTrees).catch(console.error);
      }}
    >
      Import
    </button>
  );

  return (
    <>
      <TopNav
        title={'Cross Designs'}
        buttons={[newTreeButton, importTreeButton]}
      />
      {hasRefreshedOnce && trees.length === 0 ? (
        <NoTreePlaceholder />
      ) : (
        <TreeCards
          trees={trees}
          newTreeId={newTreeId}
          setNewTreeId={setNewTreeId}
          refreshTrees={refreshTrees}
        />
      )}
    </>
  );
};

const TreeCards = (props: {
  trees: CrossTree[];
  newTreeId: string | undefined;
  setNewTreeId: (id: string | undefined) => void;
  refreshTrees: () => Promise<void>;
}): React.JSX.Element => {
  return (
    <div className='mx-36 my-8 flex flex-wrap '>
      {props.trees?.map((tree) => {
        const isNew = tree.id === props.newTreeId;
        const treeCard = (
          <TreeCard
            refreshTrees={() => {
              props.refreshTrees().catch(console.error);
            }}
            key={tree.id}
            tree={tree}
            isNew={isNew}
          />
        );
        return treeCard;
      })}
    </div>
  );
};

const NoTreePlaceholder = (): React.JSX.Element => {
  return (
    <div className='m-14 flex flex-col items-center justify-center'>
      <h2 className='text-2xl'>Cross designs can be found here.</h2>
      <h2 className='my-4 flex flex-row text-xl'>
        Click the &quot;New Tree&quot; button to start.
      </h2>
      <WormIcon className='my-8 text-9xl text-base-300' />
    </div>
  );
};

const importTree = async (): Promise<void> => {
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
    const clonedTree = CrossTree.fromJSON(file).clone();
    await insertTree(clonedTree.generateRecord(clonedTree.editable));
    toast.success('Successfully imported tree');
  } catch (err) {
    toast.error(`Error importing tree: ${err}`);
  }
};

const addTree = async (): Promise<string | undefined> => {
  try {
    const newTree: CrossTree = new CrossTree({
      name: '',
      lastSaved: new Date(),
      nodes: [],
      edges: [],
      invisibleNodes: new Set<string>(),
      crossFilters: new Map<string, OffspringFilter>(),
      editable: true,
    });
    await insertTree(newTree.generateRecord(newTree.editable));
    toast.success('Successfully added tree');
    return newTree.id;
  } catch (err) {
    toast.error(`Error adding tree: ${err}`);
    return undefined;
  }
};

export default Index;
