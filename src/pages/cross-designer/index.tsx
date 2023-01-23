import SavedTreeCard from 'components/SavedTreeCard/SavedTreeCard';
import { TopNav } from 'components/TopNav/TopNav';
import { getAllCrossTrees } from 'api/crossTree';
import { useEffect, useState } from 'react';
import CrossTree from 'models/frontend/CrossTree/CrossTree';

const CrossDesignerIndex = (): JSX.Element => {
  const [crossTrees, setCrossTrees] = useState<CrossTree[] | null>(null);

  useEffect(() => {
    getAllCrossTrees()
      .then((trees: CrossTree[]) =>
        setCrossTrees(
          trees.map((tree) => {
            return tree;
          })
        )
      )
      .catch((err) => err);
  }, []);

  return (
    <>
      <TopNav title={'Cross Designer'} />
      <div className='m-8 flex flex-wrap gap-10'>
        {crossTrees?.map((crossTree) => {
          return <SavedTreeCard key={crossTree.id} tree={crossTree} />;
        })}
      </div>
    </>
  );
};
export default CrossDesignerIndex;
