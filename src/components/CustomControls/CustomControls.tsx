import { path, fs } from '@tauri-apps/api';
import { toPng, toSvg } from 'html-to-image';
import { BsCardImage } from 'react-icons/bs';
import { FaPlus, FaMinus, FaEye } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import { type ReactFlowInstance, Controls, ControlButton } from 'reactflow';
import { open } from '@tauri-apps/api/dialog';
import { type Options } from 'html-to-image/lib/types';

interface CustomControlsProps {
  reactFlowInstance?: ReactFlowInstance;
  toggleShowGenes: () => void;
  crossDesignEditable: boolean;
}

const CustomControls = (props: CustomControlsProps): React.JSX.Element => {
  return (
    <Controls
      position='top-left'
      className='bg-base-100 text-base-content'
      showZoom={false}
      showInteractive={props.crossDesignEditable}
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

type SaveMethod = 'png' | 'svg';
const saveMethodFuncs: Record<
  SaveMethod,
  (node: HTMLElement, options: Options) => Promise<string>
> = {
  png: toPng,
  svg: toSvg,
};

const downloadImage = async (
  strainUrl: string,
  saveMethod: SaveMethod,
  dir: string | null
): Promise<void> => {
  const a = document.createElement('a');
  let filename = `cross-crossDesign-${new Date().toISOString()}.${saveMethod}`;
  // workaround  because of this: https://github.com/tauri-apps/tauri/issues/4633
  if (window.__TAURI_IPC__ !== undefined) {
    if (dir !== null && dir !== undefined) {
      filename = await path.join(dir, filename);
    }
    const strainBlob = await (await fetch(strainUrl)).blob();
    switch (saveMethod) {
      case 'png':
        fs.writeBinaryFile(filename, await strainBlob.arrayBuffer(), {
          dir: dir === null ? fs.BaseDirectory.Download : undefined,
        })
          .then(() => toast.success('Exported PNG to ' + filename))
          .catch(toast.error);
        break;
      case 'svg':
        fs.writeTextFile(filename, await strainBlob.text(), {
          dir: dir === null ? fs.BaseDirectory.Download : undefined,
        })
          .then(() => toast.success('Exported SVG to ' + filename))
          .catch(toast.error);
        break;
    }
  } else {
    a.setAttribute('download', filename);
    a.setAttribute('href', strainUrl);
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
    .then(async ([dir, strainUrl]) => {
      await downloadImage(strainUrl, saveMethod, dir as string | null);
    })
    .catch((e) => {
      alert(e);
    });
};

export default CustomControls;
