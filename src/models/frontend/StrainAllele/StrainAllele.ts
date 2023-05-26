import { db_StrainAllele } from 'models/db/db_StrainAllele';

interface iStrainAllele {
  strainName: string;
  alleleName: string;
}

export class StrainAllele {
  strainName: string;
  alleleName: string;

  constructor(fields: iStrainAllele) {
    this.strainName = fields.strainName ?? '';
    this.alleleName = fields.alleleName ?? '';
  }

  public generateRecord(): db_StrainAllele {
    return {
      strain: this.strainName,
      allele: this.alleleName,
    };
  }
}
