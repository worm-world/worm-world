import { useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  ControlProps,
  ControlButton,
  Background,
  Node,
  Edge,
  EdgeChange,
  NodeChange,
  Connection,
} from 'reactflow';
import { toPng, toSvg } from 'html-to-image';
import { FiShare } from 'react-icons/fi';
import 'reactflow/dist/style.css';
import { fs } from '@tauri-apps/api';
import {
  CrossNodeFlowWrapper,
  SelfNodeFlowWrapper,
  XNodeFlowWrapper,
} from 'components/FlowWrapper/FlowWrapper';
import { Options } from 'html-to-image/lib/types';

type SaveMethod = 'png' | 'svg';
const saveMethodFuncs: Record<SaveMethod, (node: HTMLElement, options: Options) => Promise<string>> = {
  png: toPng,
  svg: toSvg,
};

const downloadImage = async (dataUrl: string, saveMethod: SaveMethod) => {
  const a = document.createElement('a');
  const filename = `cross-tree-${(new Date()).toISOString()}.${saveMethod}`;
  // workaround  because of this: https://github.com/tauri-apps/tauri/issues/4633
  // @ts-ignore
  if (window.__TAURI_IPC__ !== undefined) {
    const dataBlob = await (await fetch(dataUrl)).blob();
    switch (saveMethod) {
      case 'png':
        fs.writeBinaryFile(filename, await dataBlob.arrayBuffer(), { dir: fs.BaseDirectory.Download }).then(() => alert("Exported PNG to Downloads")).catch((e) => alert(e));
        break;
      case 'svg':
        fs.writeTextFile(filename, await dataBlob.text(), { dir: fs.BaseDirectory.Download }).then(() => alert("Exported SVG to Downloads")).catch((e) => alert(e));
        break;
    }
  } else {
    a.setAttribute('download', filename);
    a.setAttribute('href', dataUrl);
    a.click();
  }
}

const saveImg = (saveMethod: SaveMethod) => {
  const saveFunc = saveMethodFuncs[saveMethod];
  saveFunc(document.querySelector('.react-flow')! as HTMLElement, {
    filter: (node: HTMLElement | undefined) => {
      // we don't want to add the minimap and the controls to the image
      if (
        node?.classList?.contains('react-flow__minimap') ||
        node?.classList?.contains('react-flow__controls') ||
        node?.classList?.contains('react-flow__background') ||
        node?.classList?.contains('react-flow__attribution')
      ) {
        return false;
      }
      return true;
    },
  }).then((dataUrl) => downloadImage(dataUrl, saveMethod));
};

const initialEdges: Edge[] = [
  {
    id: 'edge1',
    source: 'node1',
    target: 'xNode1',
    style: { strokeWidth: 2, stroke: 'hsla(var(--bc)/0.2)' },
  },
  {
    id: 'edge2',
    source: 'node2',
    target: 'xNode1',
    style: { strokeWidth: 2, stroke: 'hsla(var(--bc)/0.2)' },
  },
  {
    id: 'edge3',
    source: 'xNode1',
    target: 'node3',
    style: { strokeWidth: 2, stroke: 'hsla(var(--bc)/0.2)' },
  },
];

interface iCrossFlowProps {
  className?: string;
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
}

const CustomControls = (props: ControlProps) => {
  return (
    <Controls {...props}>
      <ControlButton>
        <div className='dropdown drowndown-hover m-0'>
          <label tabIndex={0} className="">
            <FiShare className='text-3xl text-base-content' />
          </label>
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
            <li><a target='_blank' onClick={() => saveImg('png')}>Export to PNG</a></li>
            <li><a target='_blank' onClick={() => saveImg('svg')}>Export to SVG</a></li>
          </ul>
        </div>
      </ControlButton>
    </Controls>
  );
}

const CrossFlow = (props: iCrossFlowProps): JSX.Element => {
  const nodeTypes = useMemo(
    () => ({
      crossNodeFlowWrapper: CrossNodeFlowWrapper,
      xNodeFlowWrapper: XNodeFlowWrapper,
      selfNodeFlowWrapper: SelfNodeFlowWrapper,
    }),
    []
  );

  return (
    <ReactFlow
      className={props.className}
      zoomOnScroll={true}
      nodeTypes={nodeTypes}
      fitView
      defaultViewport={{ x: 0, y: 0, zoom: 5 }}
      nodes={props.nodes}
      edges={props.edges}
      onNodesChange={props.onNodesChange}
      onEdgesChange={props.onEdgesChange}
      onConnect={props.onConnect}
    >
      <CustomControls position='top-left' className='bg-base-100 text-base-content' />
      <MiniMap
        position='bottom-left'
        className='bg-base-300'
        nodeClassName='bg-base-100'
      />
      <Background className='-z-50 bg-base-300' size={1} gap={16} />
    </ReactFlow>
  );
};

export default CrossFlow;
