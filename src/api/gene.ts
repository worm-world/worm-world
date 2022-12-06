import { invoke } from '@tauri-apps/api/tauri';
import { db_Gene } from 'models/db/db_Gene';
import { GeneFieldName } from 'models/db/filter/db_GeneFieldName';
import { Filter } from 'models/db/filter/filter';
import { DBError } from 'models/error';

export const getGenes = async (): Promise<db_Gene[] | DBError> => {
  try {
    const res = await invoke('get_genes');
    return res as db_Gene[];
  } catch (err) {
    return new DBError('Unable to get genes from db');
  }
};

export const getFilteredGenes = async (
  filter: Filter<GeneFieldName>
): Promise<db_Gene[] | DBError> => {
  try {
    const res = await invoke('get_filtered_genes', {
      filter,
    });
    return res as db_Gene[];
  } catch (err) {
    return new DBError('Unable to get filtered genes from db');
  }
};

export const getGene = async (name: string): Promise<db_Gene | DBError> => {
  const filter: Filter<GeneFieldName> = {
    filters: [[['Name', { Equal: name }]]],
    orderBy: [],
  };
  const res = await getFilteredGenes(filter);
  const canUseRes = !(res instanceof DBError) && res.length > 0;
  return canUseRes ? res[0] : new DBError('Unable to get specified gene');
};
