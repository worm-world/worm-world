import { useEffect, useState } from 'react';
import CrossTree from 'models/frontend/CrossTree/CrossTree';
import { getFilteredTrees, insertTree } from 'api/crossTree';
import { db_Tree } from 'models/db/db_Tree';
import SavedTreeCard from 'components/SavedTreeCard/SavedTreeCard';
import { TopNav } from 'components/TopNav/TopNav';
import { GiEarthWorm as WormIcon } from 'react-icons/gi';

const CrossDesignerPage = (): JSX.Element => {
  const [crossTrees, setCrossTrees] = useState<CrossTree[] | null>(null);

  const refreshTrees = (): void => {
    getFilteredTrees({ filters: [[['Editable', 'True']]], orderBy: [] })
      .then((trees: db_Tree[]) =>
        setCrossTrees(trees.map((tree) => CrossTree.fromJSON(tree.data)))
      )
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    refreshTrees();
  }, []);

  const newTreeButton = (
    <button
      key='newTree'
      className='btn'
      onClick={() => {
        const newTree: CrossTree = new CrossTree({
          name: 'Untitled',
          description: '',
          lastSaved: new Date(),
          settings: {
            longName: false,
            contents: false,
          },
          nodes: [],
          edges: [],
        });
        insertTree(newTree.generateRecord(true))
          .then(() => refreshTrees())
          .catch((err) => console.error(err));
      }}
    >
      New Tree
    </button>
  );

  return (
    <>
      <TopNav title={'Cross Designer'} buttons={[newTreeButton]} />
      {crossTrees !== null && crossTrees.length === 0 ? (
        <div className='m-14 flex flex-col items-center justify-center'>
          <h2 className='text-2xl'>Welcome to the Cross Designer!</h2>
          <h2 className='my-4 flex flex-row text-xl'>
            Click the &quot;New Tree&quot; button to start.
          </h2>
          <WormIcon className='my-8 text-9xl text-base-300' />
        </div>
      ) : (
        <div className='m-8 flex flex-wrap gap-10'>
          {crossTrees?.map((crossTree) => {
            return <SavedTreeCard key={crossTree.id} tree={crossTree} />;
          })}
        </div>
      )}
    </>
  );
};
export default CrossDesignerPage;
