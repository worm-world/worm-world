// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { Action } from './db_Action';

export interface db_Task {
  id: string;
  dueDate: string | null;
  action: Action;
  hermStrain: string;
  maleStrain: string | null;
  resultStrain: string | null;
  notes: string | null;
  completed: boolean;
  crossDesignId: string;
  childTaskId: string | null;
}
