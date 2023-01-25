import { useCallback, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  ControlProps,
  ControlButton,
  Background,
  Node,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  updateEdge,
  OnNodesChange,
} from 'reactflow';
import { saveAs } from 'file-saver';
import { toPng, toSvg } from 'html-to-image';
import { IoSaveSharp } from 'react-icons/io5';
import 'reactflow/dist/style.css';
import FlowWrapper from 'components/FlowWrapper/FlowWrapper';
import download from 'tauri-plugin-download-api'
import { fs, path } from '@tauri-apps/api';

enum SaveMethod {
  PNG = 'png',
  SVG = 'svg',
}

const downloadImage = async (dataUrl: string, saveMethod: SaveMethod) => {
  const a = document.createElement('a');
  const file = saveMethod === SaveMethod.PNG ? 'reactflow1.png' : 'reactflow.svg';
  // @ts-ignore
  if (window.__TAURI_IPC__ !== undefined) {
    alert(decodeURI(dataUrl))
    const downloadDir = await path.downloadDir();
    var data;
    const dataBlob = await (await fetch(dataUrl)).blob();
    if (saveMethod === SaveMethod.PNG) {
      fs.writeBinaryFile(prompt("PNG export name:", "blah.png") ?? "blah.png", await dataBlob.arrayBuffer(), { dir: fs.BaseDirectory.Download }).then(() => alert("Exported PNG")).catch((e) => alert(e));
    } else {
      fs.writeTextFile(prompt("SVG export name:", "blah.svg") ?? "blah.svg", await dataBlob.text(), { dir: fs.BaseDirectory.Download }).then(() => alert("Exported SVG")).catch((e) => alert(e));
    }
  } else {
    a.setAttribute('download', file);
    a.setAttribute('href', dataUrl);
    a.click();
  }

  // // a.setAttribute('href', dataUrl);
  // saveAs("hey", "boi.png");
  // alert(dataUrl);
}

const saveImg = (saveMethod: SaveMethod) => {
  const saveFunc = saveMethod === SaveMethod.PNG ? toPng : toSvg;
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
  onNodesChange: OnNodesChange;
}

const CustomControls = (props: ControlProps) => {
  return (
    <Controls {...props}>
      <ControlButton onClick={() => console.log('action')}>
        <div className='dropdown drowndown-hover m-0'>
          <label tabIndex={0} className="">
            <IoSaveSharp className='text-4xl text-base-content' />
          </label>
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
            <li><a target='_blank' onClick={() => saveImg(SaveMethod.PNG)}>Export to PNG</a></li>
            <li><a target='_blank' onClick={() => saveImg(SaveMethod.SVG)}>Export to SVG</a></li>
          </ul>
        </div>
      </ControlButton>
    </Controls>
  );
}

const CrossFlow = (props: iCrossFlowProps): JSX.Element => {
  const nodeTypes = useMemo(() => ({ flowWrapper: FlowWrapper }), []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onEdgeUpdate = useCallback(
    (oldEdge: Edge<any>, newConnection: Connection) =>
      setEdges((els) => updateEdge(oldEdge, newConnection, els)),
    []
  );
  const onConnect = useCallback(
    (params: Edge<any> | Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  return (
    <ReactFlow
      className={props.className}
      zoomOnScroll={true}
      fitView
      nodes={props.nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={props.onNodesChange}
      onEdgesChange={onEdgesChange}
      onEdgeUpdate={onEdgeUpdate}
      onConnect={onConnect}
      defaultViewport={{ x: 0, y: 0, zoom: 5 }}
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
