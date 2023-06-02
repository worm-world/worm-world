import { open } from '@tauri-apps/api/dialog';
import { readTextFile } from '@tauri-apps/api/fs';
import { getFilteredTrees, insertTree } from 'api/crossTree';
import { type CrossEditorFilter } from 'components/CrossFilterModal/CrossEditorFilter';
import SavedTreeCard from 'components/SavedTreeCard/SavedTreeCard';
import { TopNav } from 'components/TopNav/TopNav';
import CrossTree from 'models/frontend/CrossTree/CrossTree';
import { useEffect, useState } from 'react';
import { GiEarthWorm as WormIcon } from 'react-icons/gi';
import { toast } from 'react-toastify';

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
        addTree().then(refreshTrees).catch(console.error);
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
    <div className='overflow-x-hidden'>
      <TopNav
        title={'Cross Designs'}
        buttons={[newTreeButton, importTreeButton]}
      />
      {hasRefreshedOnce && crossTrees.length === 0 ? (
        <NoTreePlaceholder />
      ) : (
        <div className='mx-36 my-8 flex flex-wrap '>
          {crossTrees?.map((crossTree) => {
            return (
              <SavedTreeCard
                refreshTrees={() => {
                  refreshTrees().catch(console.error);
                }}
                key={crossTree.id}
                tree={crossTree}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const NoTreePlaceholder = (): JSX.Element => {
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

const addTree = async (): Promise<void> => {
  try {
    const newTree: CrossTree = new CrossTree({
      name: '',
      lastSaved: new Date(),
      nodes: [],
      edges: [],
      invisibleNodes: new Set<string>(),
      crossFilters: new Map<string, CrossEditorFilter>(),
      editable: true,
    });
    await insertTree(newTree.generateRecord(newTree.editable));
    toast.success('Successfully added tree');
  } catch (err) {
    toast.error(`Error adding tree: ${err}`);
  }
};

export default CrossDesignerPage;
