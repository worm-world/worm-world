import {
  useMemo,
  type MouseEvent as ReactMouseEvent,
  type TouchEvent as ReactTouchEvent,
} from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  ControlButton,
  Background,
  type Node,
  type Edge,
  type EdgeChange,
  type NodeChange,
  type Connection,
  type ReactFlowInstance,
  type OnConnectStartParams,
  ConnectionMode,
  ReactFlowProvider,
} from 'reactflow';
import { toPng, toSvg } from 'html-to-image';
import 'reactflow/dist/style.css';
import { open } from '@tauri-apps/api/dialog';
import { fs, path } from '@tauri-apps/api';
import {
  StrainFlowWrapper,
  SelfIconFlowWrapper,
  XIconFlowWrapper,
  NoteFlowWrapper,
  FilteredOutFlowWrapper,
} from 'components/FlowWrapper/FlowWrapper';
import { type Options } from 'html-to-image/lib/types';
import { toast } from 'react-toastify';
import { FaPlus, FaMinus, FaEye } from 'react-icons/fa';
import { BsCardImage } from 'react-icons/bs';

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
  saveMethod: SaveMethod,
  dir: string | null
): Promise<void> => {
  const a = document.createElement('a');
  let filename = `cross-tree-${new Date().toISOString()}.${saveMethod}`;
  // workaround  because of this: https://github.com/tauri-apps/tauri/issues/4633
  if (window.__TAURI_IPC__ !== undefined) {
    if (dir !== null && dir !== undefined) {
      filename = await path.join(dir, filename);
    }
    const dataBlob = await (await fetch(dataUrl)).blob();
    switch (saveMethod) {
      case 'png':
        fs.writeBinaryFile(filename, await dataBlob.arrayBuffer(), {
          dir: dir === null ? fs.BaseDirectory.Download : undefined,
        })
          .then(() => toast.success('Exported PNG to ' + filename))
          .catch(toast.error);
        break;
      case 'svg':
        fs.writeTextFile(filename, await dataBlob.text(), {
          dir: dir === null ? fs.BaseDirectory.Download : undefined,
        })
          .then(() => toast.success('Exported SVG to ' + filename))
          .catch(toast.error);
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
  Promise.all([
    open({
      directory: true,
    }),
    saveFunc(reactFlowElem as HTMLElement, {
      width: 1920,
      height: 1080,
      quality: 1,
      skipAutoScale: false,
      pixelRatio: 1,
      filter: (node: Element | undefined) => {
        // we don't want to add the minimap and the controls to the image
        if (node === undefined) {
          return false;
        } else if (
          node.classList !== undefined &&
          (node.classList.contains('react-flow__minimap') ||
            node.classList.contains('react-flow__controls') ||
            node.classList.contains('react-flow__background') ||
            node.classList.contains('react-flow__attribution'))
        ) {
          return false;
        }
        return true;
      },
    }),
  ])
    .then(async ([dir, dataUrl]) => {
      await downloadImage(dataUrl, saveMethod, dir as string | null);
    })
    .catch((e) => {
      alert(e);
    });
};

interface CrossFlowProps {
  innerRef?: any;
  className?: string;
  nodes: Node[];
  edges: Edge[];
  onInit?: (reactFlowInstance: ReactFlowInstance) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  onConnectStart: (
    event: ReactMouseEvent | ReactTouchEvent,
    params: OnConnectStartParams
  ) => void;
  onConnectEnd: (event: MouseEvent | TouchEvent) => void;
  onNodeDragStop: () => void;
  reactFlowInstance?: ReactFlowInstance;
  toggleShowGenes: () => void;
  treeEditable: boolean;
}

interface CustomControlsProps {
  reactFlowInstance?: ReactFlowInstance;
  toggleShowGenes: () => void;
  treeEditable: boolean;
}

const CustomControls = (props: CustomControlsProps): JSX.Element => {
  return (
    <Controls
      position='top-left'
      className='bg-base-100 text-base-content'
      showZoom={false}
      showInteractive={props.treeEditable}
    >
      <ControlButton
        onClick={() => props.reactFlowInstance?.zoomIn({ duration: 150 })}
      >
        <FaPlus className='hover:cursor-pointer' />
      </ControlButton>
      <ControlButton
        onClick={() => props.reactFlowInstance?.zoomOut({ duration: 150 })}
      >
        <FaMinus className='hover:cursor-pointer' />
      </ControlButton>
      <ControlButton className='drowndown-hover dropdown'>
        <div>
          <label tabIndex={0} className=''>
            <BsCardImage className='text-3xl text-base-content hover:cursor-pointer' />
          </label>
          <ul
            tabIndex={0}
            className='dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow'
          >
            <li>
              <a
                target='_blank'
                onClick={() => {
                  saveImg('png');
                }}
              >
                Export to PNG
              </a>
            </li>
            <li>
              <a
                target='_blank'
                onClick={() => {
                  saveImg('svg');
                }}
              >
                Export to SVG
              </a>
            </li>
          </ul>
        </div>
      </ControlButton>
      <ControlButton
        onClick={() => {
          props.toggleShowGenes();
        }}
      >
        <FaEye />
      </ControlButton>
    </Controls>
  );
};

export enum FlowType {
  Strain = 'strain',
  XIcon = 'xIcon',
  SelfIcon = 'selfIcon',
  Note = 'note',
  FilteredOut = 'filteredOut',
}

const CrossFlow = (props: CrossFlowProps): JSX.Element => {
  const nodeTypes = useMemo(
    () => ({
      strain: StrainFlowWrapper,
      xIcon: XIconFlowWrapper,
      selfIcon: SelfIconFlowWrapper,
      note: NoteFlowWrapper,
      filteredOut: FilteredOutFlowWrapper,
    }),
    []
  );

  return (
    <ReactFlowProvider>
      <ReactFlow
        ref={props.innerRef}
        className={props.className}
        zoomOnScroll={true}
        nodeTypes={nodeTypes}
        fitView
        defaultViewport={{ x: 0, y: 0, zoom: 5 }}
        onInit={props.onInit}
        nodes={props.nodes}
        edges={props.edges}
        onNodesChange={props.onNodesChange}
        onEdgesChange={props.onEdgesChange}
        onConnect={props.onConnect}
        onConnectStart={props.onConnectStart}
        onConnectEnd={props.onConnectEnd}
        nodesFocusable
        connectionMode={ConnectionMode.Loose}
        onNodeDragStop={props.onNodeDragStop}
        nodesDraggable={props.treeEditable}
        elementsSelectable={props.treeEditable}
      >
        <CustomControls
          reactFlowInstance={props.reactFlowInstance}
          toggleShowGenes={props.toggleShowGenes}
          treeEditable={props.treeEditable}
        />
        <MiniMap
          position='bottom-left'
          className='bg-base-300'
          nodeClassName='bg-base-100'
        />
        <Background className='-z-50 bg-base-300' size={1} gap={16} />
      </ReactFlow>
    </ReactFlowProvider>
  );
};

export default CrossFlow;
