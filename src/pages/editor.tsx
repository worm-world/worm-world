import { getTree } from 'api/crossTree';
import CrossTree from 'models/frontend/CrossTree/CrossTree';
import { useLocation } from 'react-router-dom';
import Editor from 'components/Editor/Editor';
import { useEffect, useState } from 'react';
import Spinner from 'components/Spinner/Spinner';
import { FlowType } from 'components/CrossFlow/CrossFlow';
import { AllelePair } from 'models/frontend/AllelePair/AllelePair';
import { Strain } from 'models/frontend/Strain/Strain';

const EditorPage = (): JSX.Element => {
  const [tree, setTree]: [CrossTree | null, (tree: CrossTree | null) => void] =
    useState<CrossTree | null>(null);

  const treeId: string = useLocation().state.treeId;

  useEffect(() => {
    getTree(treeId)
      .then((dbTree) => {
        const tree = CrossTree.fromJSON(dbTree.data);
        fixTreeDeserialization(tree);
        setTree(tree);
      })
      .catch(console.error);
  });

  if (tree === null) {
    return <Spinner />;
  } else {
    return <Editor crossTree={tree} />;
  }
};

const fixTreeDeserialization = (tree: CrossTree): void => {
  for (const node of tree.nodes) {
    if (node.type === FlowType.Strain) {
      // Strain's chromPairMap deserialized as object -- should be Map
      const chromPairObj = node.data.strain.chromPairMap;
      const allelePairs: AllelePair[] = [];
      for (const key in chromPairObj) {
        allelePairs.push(
          ...chromPairObj[key].allelePairs.map((pair: unknown) =>
            AllelePair.fromJSON(JSON.stringify(pair))
          )
        );
      }
      node.data.strain = new Strain({
        name: node.data.strain.name,
        allelePairs,
        description: node.data.strain.description,
      });
    }
  }
};

export default EditorPage;
