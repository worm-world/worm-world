import { db_Error } from 'models/db/db_Error';

export const isDbError = (res: any | db_Error): res is db_Error => {
  return res?.SqlQueryError !== undefined || res?.SqlInsertError !== undefined;
};
