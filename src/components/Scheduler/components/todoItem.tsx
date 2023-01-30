import Conditional from 'components/Conditional/Conditional';
import {
  TbArrowsCross as CrossIcon,
  TbArrowLoopLeft2 as SelfIcon,
  TbSnowflake as FreezeIcon,
  TbMicroscope as PCRIcon,
} from 'react-icons/tb';
import CrossNode from 'components/CrossNode/CrossNode';
import * as mock from 'models/frontend/CrossNode/CrossNode.mock';
import TodoActions from './todoActions';
import TodoModals from '../todoModals';

export interface ITodoItemProps {
  isMarried?: boolean;
  isSingle?: boolean;
  shouldFreeze?: boolean;
  shouldPCR?: boolean;
}

const TodoItem = (props: ITodoItemProps): JSX.Element => {
  const isMarried = Boolean(props.isMarried); // Will be true when there are two parents in the cross -- not just a self cross
  const isSingle = Boolean(props.isSingle); // Similarly, will be true when this cross is a self cross
  const shouldFreeze = Boolean(props.shouldFreeze); // Will be true when these worms should be frozen and saved until a later date
  const shouldPCR = Boolean(props.shouldPCR);
  return (
    <>
      <Conditional condition={isMarried}>
        <div className='relative mt-8 mb-8 mr-8 flex h-36 items-center justify-items-start'>
          <TodoActions />
          <div className='relative grid h-36 w-5/6 grid-cols-4 items-center justify-items-center'>
            <CrossNode model={mock.mutated} />
            <div className='p-8'>
              <div className='mb-2 h-16 w-16 rounded-full border-2 border-neutral bg-accent '>
                <div className='flex h-full items-center justify-center '>
                  <CrossIcon size='35' className='stroke-neutral'></CrossIcon>
                  <label
                    className='btn absolute z-0 w-16 opacity-0'
                    htmlFor='conditions'
                  ></label>
                </div>
              </div>
              4 Plates
            </div>
            <CrossNode model={mock.diploid} />
            <textarea
              className='textarea-accent textarea ml-16 h-40 w-32'
              placeholder='Notes'
            ></textarea>
            <TodoModals />
          </div>
        </div>
      </Conditional>

      <Conditional condition={isSingle}>
        <div className='relative mt-8 mb-8 mr-8 flex h-36 items-center justify-items-start'>
          <TodoActions />
          <div className='relative grid h-36 w-5/6 grid-cols-4 items-center justify-items-center'>
            <CrossNode model={mock.mutated} />
            <div className='p-8'>
              <div className='mb-2 h-16 w-16 rounded-full border-2 border-neutral bg-accent '>
                <div className='flex h-full items-center justify-center '>
                  <SelfIcon size='35' className='stroke-neutral'></SelfIcon>

                  <label
                    className='btn absolute z-0 w-16 opacity-0'
                    htmlFor='conditions'
                  ></label>
                </div>
              </div>
              2 Plates
            </div>
            <textarea
              className='textarea-accent textarea h-32 w-64'
              placeholder='Notes'
            ></textarea>
            <TodoModals />
          </div>
        </div>
      </Conditional>

      <Conditional condition={shouldFreeze}>
        <div className='relative mt-8 mb-8 mr-8 flex h-36 items-center justify-items-start'>
          <TodoActions />
          <div className='relative grid h-36 w-5/6 grid-cols-4 items-center justify-items-center'>
            <CrossNode model={mock.mutated} />
            <div className='p-8'>
              <div className='h-16 w-16 rounded-full border-2 border-neutral bg-accent '>
                <div className='flex h-full items-center justify-center '>
                  <FreezeIcon size='35' className='stroke-neutral'></FreezeIcon>
                </div>
              </div>
            </div>
            <textarea
              className='textarea-accent textarea h-32 w-64'
              placeholder='Notes'
            ></textarea>
            <TodoModals />
          </div>
        </div>
      </Conditional>

      <Conditional condition={shouldPCR}>
        <div className='relative mt-8 mb-8 mr-8 flex h-36 items-center justify-items-start'>
          <TodoActions />
          <div className='relative grid h-36 w-5/6 grid-cols-4 items-center justify-items-center'>
            <CrossNode model={mock.mutated} />
            <div className='p-8'>
              <div className='h-16 w-16 rounded-full border-2 border-neutral bg-accent '>
                <div className='flex h-full items-center justify-center '>
                  <PCRIcon size='35' className='stroke-neutral'></PCRIcon>
                </div>
              </div>
            </div>
            <textarea
              className='textarea-accent textarea h-32 w-64'
              placeholder='Notes'
            ></textarea>
            <TodoModals />
          </div>
        </div>
      </Conditional>
    </>
  );
};

export default TodoItem;
