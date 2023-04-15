import { invoke } from '@tauri-apps/api/tauri';
import { db_Gene } from 'models/db/db_Gene';
import { GeneFieldName } from 'models/db/filter/db_GeneFieldName';
import {
  FilterGroup,
  getSingleRecordOrThrow,
} from 'models/db/filter/FilterGroup';
import { Gene } from 'models/frontend/Gene/Gene';

export const getGenes = async (): Promise<db_Gene[]> => {
  return await invoke('get_genes');
};

export const getFilteredGenes = async (
  filter: FilterGroup<GeneFieldName>
): Promise<db_Gene[]> => {
  return await invoke('get_filtered_genes', {
    filter,
  });
};

export const getCountFilteredGenes = async (
  filter: FilterGroup<GeneFieldName>
): Promise<number> => {
  return await invoke('get_count_filtered_genes', {
    filter,
  });
};

export const getGene = async (name: string): Promise<db_Gene> => {
  const filter: FilterGroup<GeneFieldName> = {
    filters: [[['SysName', { Equal: name }]]],
    orderBy: [],
  };
  const res = await getFilteredGenes(filter);
  return getSingleRecordOrThrow(
    res,
    `Unable to find any genes with the name: ${name}`
  );
};

export const insertGene = async (gene: Gene): Promise<void> => {
  await insertDbGene(gene.generateRecord());
};

export const insertDbGene = async (record: db_Gene): Promise<void> => {
  await invoke('insert_gene', { gene: record });
};

export const insertGenesFromFile = async (path: string): Promise<void> => {
  await invoke('insert_genes_from_file', { path });
};

export const deleteFilteredGenes = async (
  filter: FilterGroup<GeneFieldName>
): Promise<void> => {
  await invoke('delete_filtered_genes', { filter });
};

export const deleteGene = async (gene: db_Gene): Promise<void> => {
  const filter: FilterGroup<GeneFieldName> = {
    filters: [[['SysName', { Equal: gene.sysName }]]],
    orderBy: [],
  };

  await deleteFilteredGenes(filter);
};
