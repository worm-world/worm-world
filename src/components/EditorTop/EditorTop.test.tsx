import { render, screen } from '@testing-library/react';
import EditorTop from 'components/EditorTop/EditorTop';
import CrossDesign from 'models/frontend/CrossDesign/CrossDesign';

describe('Editor Top', () => {
  test('Component renders', async () => {
    render(
      <EditorTop
        crossDesign={
          new CrossDesign({
            name: 'My Tree',
            nodes: [],
            edges: [],
            lastSaved: new Date(),
            offspringFilters: new Map(),
            editable: true,
          })
        }
        isSaving={false}
        lastSaved={new Date()}
        name={''}
        setName={function (name: string): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    expect(screen.getByRole('heading')).toBeDefined();
  });
});
