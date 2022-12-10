import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface iToastInfoProps {
  message: string;
  moreInfo: string;
}

export default function ToastInfo(props: iToastInfoProps): JSX.Element {
  return (
    <div>
      <p className='p-2'>{props.message}</p>
      <Accordion className='mt-2'>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className='text-zinc-400'>More info</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography className='text-zinc-400'>{props.moreInfo}</Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
