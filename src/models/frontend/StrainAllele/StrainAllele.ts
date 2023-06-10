import { type db_StrainAllele } from 'models/db/db_StrainAllele';

interface iStrainAllele {
  strainName: string;
  alleleName: string;
  isOnTop: boolean;
  isOnBot: boolean;
}

export class StrainAllele {
  strainName: string;
  alleleName: string;
  isOnTop: boolean;
  isOnBot: boolean;

  constructor(fields: iStrainAllele) {
    this.strainName = fields.strainName ?? '';
    this.alleleName = fields.alleleName ?? '';
    this.isOnTop = fields.isOnTop;
    this.isOnBot = fields.isOnBot;
  }

  public generateRecord(): db_StrainAllele {
    return {
      strain_name: this.strainName,
      allele_name: this.alleleName,
      is_on_top: this.isOnTop,
      is_on_bot: this.isOnBot,
    };
  }
}
