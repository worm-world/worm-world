import { Card, Typography } from '@mui/material';
interface IScheduleNodeProps {
  text: string;
}
const ScheduleNode = (props: IScheduleNodeProps): JSX.Element => {
  return (
    <div>
      <Card>
        <div className='h-36 w-80'>
          <Typography>{props.text}</Typography>
        </div>
      </Card>
    </div>
  );
};

export default ScheduleNode;
