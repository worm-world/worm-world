// This was ported out to it's own file since (de)serialization was being belligerant

import { Exclude } from 'class-transformer';

export interface NoteNodePropsProps {
  content: string;
  onDoubleClick: () => void;
}

export class NoteNodeProps {
  content: string;

  @Exclude()
  onDoubleClick: () => void;

  constructor(props: NoteNodePropsProps) {
    if (props !== null && props !== undefined) {
      this.content = props.content;
      this.onDoubleClick = props.onDoubleClick;
    } else {
      this.content = '';
      this.onDoubleClick = () => {};
    }
  }
}
