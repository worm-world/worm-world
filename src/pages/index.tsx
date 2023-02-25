import { useEffect, useState } from 'react';
import CrossTree from 'models/frontend/CrossTree/CrossTree';
import { getFilteredTrees, insertTree } from 'api/crossTree';
import SavedTreeCard from 'components/SavedTreeCard/SavedTreeCard';
import { TopNav } from 'components/TopNav/TopNav';
import { GiEarthWorm as WormIcon } from 'react-icons/gi';
import { open } from '@tauri-apps/api/dialog';
import { readTextFile } from '@tauri-apps/api/fs';
import { toast } from 'react-toastify';
import { CrossEditorFilter } from 'components/CrossFilterModal/CrossEditorFilter';

const CrossDesignerPage = (): JSX.Element => {
  const [crossTrees, setCrossTrees] = useState<CrossTree[]>([]);
  const [hasRefreshedOnce, setHasRefreshedOnce] = useState(false);

  const refreshTrees = async (): Promise<void> => {
    const trees = await getFilteredTrees({
      filters: [[['Editable', 'True']]],
      orderBy: [],
    });

    setCrossTrees(trees.map((tree) => CrossTree.fromJSON(tree.data)));
  };

  useEffect(() => {
    refreshTrees()
      .then(() => setHasRefreshedOnce(true))
      .catch((error) => console.error(error));
  }, []);

  const newTreeButton = (
    <button
      key='newTree'
      className='btn'
      onClick={() => {
        addTree()
          .then(refreshTrees)
          .catch((err) => console.error(err));
      }}
    >
      New Tree
    </button>
  );

  const importTreeButton = (
    <button
      key='importTree'
      className='btn'
      onClick={() => {
        importTree()
          .then(refreshTrees)
          .catch((err) => console.error(err));
      }}
    >
      Import
    </button>
  );

  return (
    <>
      <TopNav
        title={'Cross Designer'}
        buttons={[newTreeButton, importTreeButton]}
      />
      {hasRefreshedOnce && crossTrees.length === 0 ? (
        <NoTreePlaceholder />
      ) : (
        <div className='m-8 flex flex-wrap gap-10'>
          {crossTrees?.map((crossTree) => {
            return (
              <SavedTreeCard
                refreshTrees={() => {
                  refreshTrees().catch((error) => console.error(error));
                }}
                key={crossTree.id}
                tree={crossTree}
              />
            );
          })}
        </div>
      )}
    </>
  );
};

const NoTreePlaceholder = (): JSX.Element => {
  return (
    <div className='m-14 flex flex-col items-center justify-center'>
      <h2 className='text-2xl'>Welcome to the Cross Designer!</h2>
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
    await insertTree(clonedTree.generateRecord(true));
    toast.success('Successfully imported tree');
  } catch (err) {
    toast.error(`Error importing tree: ${err}`);
  }
};

const addTree = async (): Promise<void> => {
  try {
    const newTree: CrossTree = new CrossTree({
      name: '',
      description: '',
      lastSaved: new Date(),
      settings: {
        longName: false,
        contents: false,
      },
      nodes: [],
      edges: [],
      invisibleNodes: new Set<string>(),
      crossFilters: new Map<string, CrossEditorFilter>(),
    });
    await insertTree(newTree.generateRecord(true));
    toast.success('Successfully added tree');
  } catch (err) {
    toast.error(`Error adding tree: ${err}`);
  }
};

export default CrossDesignerPage;
