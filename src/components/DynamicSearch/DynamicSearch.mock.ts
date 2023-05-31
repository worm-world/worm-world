import { type db_Allele } from 'models/db/db_Allele';

export const getDbAlleles = (): db_Allele[] => {
  return [
    {
      name: 'allele1',
      sysGeneName: 'SG1.1',
      variationName: null,
      contents: null,
    },
    {
      name: 'allele2',
      sysGeneName: 'SG1.1',
      variationName: null,
      contents: null,
    },
    {
      name: 'allele3',
      sysGeneName: 'SG1.2',
      variationName: null,
      contents: null,
    },
    {
      name: 'allele4',
      sysGeneName: 'SG1.3',
      variationName: null,
      contents: null,
    },
    {
      name: 'allele5',
      sysGeneName: 'SG1.3',
      variationName: null,
      contents: null,
    },
    {
      name: 'myallele1',
      sysGeneName: 'SG1.4',
      variationName: null,
      contents: null,
    },
  ];
};
