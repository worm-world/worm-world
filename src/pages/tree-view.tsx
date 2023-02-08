import { getTree } from 'api/crossTree';
import CrossTree from 'models/frontend/CrossTree/CrossTree';
import { useLocation } from 'react-router-dom';
import CrossEditor from 'components/CrossEditor/CrossEditor';
import { useEffect, useState } from 'react';
import { FlowType } from 'components/CrossFlow/CrossFlow';
import { Strain } from 'models/frontend/Strain/Strain';
import { AllelePair } from 'models/frontend/Strain/AllelePair';

const TreeViewPage = (): JSX.Element => {
  const [tree, setTree]: [CrossTree | null, (tree: CrossTree | null) => void] =
    useState<CrossTree | null>(null);

  const treeId: string = useLocation().state.treeId;

  useEffect(() => {
    getTree(treeId)
      .then((newDbTree) => {
        const newTree = CrossTree.fromJSON(newDbTree.data);
        fixTreeDeserialization(newTree);
        setTree(newTree);
      })
      .catch((err) => console.error(err));
  }, []);

  if (tree === null) {
    return <>Loading</>;
  } else {
    return <CrossEditor crossTree={tree} />;
  }
};

// TODO: remove once issue number #154 is resolved
const fixTreeDeserialization = (tree: CrossTree): void => {
  for (const node of tree.nodes) {
    if (node.type === FlowType.Strain) {
      // Menu items deserialized as [] -- should be undefined
      node.data.getMenuItems = undefined;

      // Strain's chromPairMap deserialized as object -- should be Map
      const chromPairObj = node.data.strain.chromPairMap;
      const allelePairs = [];
      for (const key in chromPairObj) {
        allelePairs.push(
          AllelePair.fromJSON(JSON.stringify(chromPairObj[key]))
        );
      }
      node.data.strain = new Strain({
        name: node.data.strain.name,
        allelePairs,
        notes: node.data.strain.notes,
      });
    }
  }
};

export default TreeViewPage;
