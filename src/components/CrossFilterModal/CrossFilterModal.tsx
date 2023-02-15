import CrossNode from 'components/CrossNode/CrossNode';
import { CrossNodeModel } from 'models/frontend/CrossNode/CrossNode';
import { Node } from 'reactflow';
import { CgClose as CloseIcon } from 'react-icons/cg';

export interface CrossFilterProps {
  childNodes: Array<Node<CrossNodeModel>>;
  invisibleSet: Set<string>;
  toggleVisible: (nodeId: string) => void;
}
export const CrossFilterModal = (props: CrossFilterProps): JSX.Element => {
  return (
    <>
      <input type='checkbox' id='cross-filter-modal' className='modal-toggle' />
      <label htmlFor='cross-filter-modal' className='modal cursor-pointer'>
        <label className='modal-box bg-base-200' htmlFor=''>
          <div className='flex flex-row justify-between'>
            <h3 className='text-2xl font-bold'>Filter Child Strains</h3>
            <label
              htmlFor='cross-filter-modal'
              className='btn-outline btn-sm btn text-xl'
            >
              <CloseIcon />
            </label>
          </div>
          <div className='divider' />
          <StrainList {...props} />
        </label>
      </label>
    </>
  );
};

const StrainList = (props: CrossFilterProps): JSX.Element => {
  const childNodes = props.childNodes !== undefined ? props.childNodes : [];
  const strainList: JSX.Element[] = [];

  let idx = 0;
  childNodes.forEach((strain: Node<CrossNodeModel>) => {
    const key = `cross-filter-modal-item-${idx}`;
    strainList.push(
      <li key={key}>
        <div className='my-2 mr-4 flex origin-center flex-row items-center justify-center'>
          <input
            type='checkbox'
            checked={!props.invisibleSet.has(strain.id)}
            className='checkbox mx-4'
            onClick={() => props.toggleVisible(strain.id)}
            key={`cross-filter-modal-item-${idx++}-checkbox`}
            readOnly
          />
          <CrossNode model={strain.data} />
        </div>
      </li>
    );
  });

  return <ul className='form-control'>{strainList}</ul>;
};
