import { invoke } from '@tauri-apps/api/tauri';
import { db_Error } from 'models/db/db_Error';
import { db_Gene } from 'models/db/db_Gene';
import { GeneFieldName } from 'models/db/filter/db_GeneFieldName';
import { Filter, getSingleRecordOrError } from 'models/db/Filter';
import { isDbError } from 'models/error';
import { Gene } from 'models/frontend/Gene';

export const getGenes = async (): Promise<db_Gene[] | db_Error> => {
  return await invoke('get_genes');
};

export const getFilteredGenes = async (
  filter: Filter<GeneFieldName>
): Promise<db_Gene[] | db_Error> => {
  return await invoke('get_filtered_genes', {
    filter,
  });
};

export const getGene = async (name: string): Promise<db_Gene | db_Error> => {
  const filter: Filter<GeneFieldName> = {
    filters: [[['Name', { Equal: name }]]],
    orderBy: [],
  };
  const res = await getFilteredGenes(filter);
  return getSingleRecordOrError(
    res,
    `Unable to find any genes with the name: ${name}`
  );
};

export const insertGene = async (gene: Gene): Promise<undefined | db_Error> => {
  const res = await insertDbGene(gene.generateRecord());
  if (isDbError(res)) return res;
};

export const insertDbGene = async (
  record: db_Gene
): Promise<undefined | db_Error> => {
  const res = await invoke('insert_gene', { gene: record });
  if (isDbError(res)) return res;
};
