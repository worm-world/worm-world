import { StoryFn, Meta } from '@storybook/react';
import CrossDesignCard from 'components/CrossDesignCard/CrossDesignCard';
import CrossDesign from 'models/frontend/CrossDesign/CrossDesign';
import * as crossDesigns from 'models/frontend/CrossDesign/CrossDesign.mock';
import { BrowserRouter } from 'react-router-dom';

const MockCrossDesignCard = ({
  crossDesign: crossDesign,
}: {
  crossDesign: CrossDesign;
}): React.JSX.Element => {
  return (
    <BrowserRouter>
      <CrossDesignCard crossDesign={crossDesign} refreshCrossDesigns={() => { } } isNew={false}></CrossDesignCard>
    </BrowserRouter>
  );
};

export default {
  title: 'Components/CrossDesignCard',
  component: CrossDesignCard,
} as Meta<typeof CrossDesignCard>;

const Template: StoryFn<typeof CrossDesignCard> = (args) => {
  return <MockCrossDesignCard {...args}></MockCrossDesignCard>;
};

export const Primary = Template.bind({});
Primary.args = { crossDesign: crossDesigns.simpleCrossDesign };
