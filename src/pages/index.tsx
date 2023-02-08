import { useEffect, useState } from 'react';
import CrossTree from 'models/frontend/CrossTree/CrossTree';
import { getFilteredTrees, insertTree } from 'api/crossTree';
import { db_Tree } from 'models/db/db_Tree';
import SavedTreeCard from 'components/SavedTreeCard/SavedTreeCard';
import { TopNav } from 'components/TopNav/TopNav';

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
      <div className='m-8 flex flex-wrap gap-10'>
        {crossTrees?.map((crossTree) => {
          return <SavedTreeCard key={crossTree.id} tree={crossTree} />;
        })}
      </div>
    </>
  );
};
export default CrossDesignerPage;
