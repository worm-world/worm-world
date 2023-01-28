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
const saveMethodFuncs: Record<
  SaveMethod,
  (node: HTMLElement, options: Options) => Promise<string>
> = {
  png: toPng,
  svg: toSvg,
};

const downloadImage = async (
  dataUrl: string,
  saveMethod: SaveMethod
): Promise<void> => {
  const a = document.createElement('a');
  const filename = `cross-tree-${new Date().toISOString()}.${saveMethod}`;
  // workaround  because of this: https://github.com/tauri-apps/tauri/issues/4633
  if (window.__TAURI_IPC__ !== undefined) {
    const dataBlob = await (await fetch(dataUrl)).blob();
    switch (saveMethod) {
      case 'png':
        fs.writeBinaryFile(filename, await dataBlob.arrayBuffer(), {
          dir: fs.BaseDirectory.Download,
        })
          .then(() => alert('Exported PNG to Downloads'))
          .catch((e) => alert(e));
        break;
      case 'svg':
        fs.writeTextFile(filename, await dataBlob.text(), {
          dir: fs.BaseDirectory.Download,
        })
          .then(() => alert('Exported SVG to Downloads'))
          .catch((e) => alert(e));
        break;
    }
  } else {
    a.setAttribute('download', filename);
    a.setAttribute('href', dataUrl);
    a.click();
  }
};

const saveImg = (saveMethod: SaveMethod): void => {
  const saveFunc = saveMethodFuncs[saveMethod];
  const reactFlowElem = document.querySelector('.react-flow');
  if (reactFlowElem === null) {
    alert('Could not find react-flow element');
    return;
  }
  saveFunc(reactFlowElem as HTMLElement, {
    filter: (node: Element | undefined) => {
      // we don't want to add the minimap and the controls to the image
      if (node === undefined || node.classList === undefined) {
        return false;
      }
      else if (
        node.classList.contains('react-flow__minimap') ||
        node.classList.contains('react-flow__controls') ||
        node.classList.contains('react-flow__background') ||
        node.classList.contains('react-flow__attribution')
      ) {
        return false;
      }
      return true;
    },
  })
    .then(async (dataUrl) => await downloadImage(dataUrl, saveMethod))
    .catch((e) => alert(e));
};

interface iCrossFlowProps {
  className?: string;
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
}

const CustomControls = (props: ControlProps): JSX.Element => {
  return (
    <Controls {...props}>
      <ControlButton>
        <div className='drowndown-hover dropdown m-0'>
          <label tabIndex={0} className=''>
            <FiShare className='text-3xl text-base-content' />
          </label>
          <ul
            tabIndex={0}
            className='dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow'
          >
            <li>
              <a target='_blank' onClick={() => saveImg('png')}>
                Export to PNG
              </a>
            </li>
            <li>
              <a target='_blank' onClick={() => saveImg('svg')}>
                Export to SVG
              </a>
            </li>
          </ul>
        </div>
      </ControlButton>
    </Controls>
  );
};

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
      <CustomControls
        position='top-left'
        className='bg-base-100 text-base-content'
      />
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
