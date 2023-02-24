import { Exclude, instanceToPlain, plainToInstance } from 'class-transformer';
import { db_Condition } from 'models/db/db_Condition';
import { AffectedTraits } from 'models/frontend/Phenotype/Phenotype';

interface ICondition extends AffectedTraits {
  name: string;
  description?: string;
}

export class Condition {
  name: string = '';
  description?: string;
  maleMating?: number;
  lethal?: boolean;
  femaleSterile?: boolean;
  arrested?: boolean;
  maturationDays?: number;

  constructor(fields: ICondition) {
    Object.assign(this, fields);
  }

  static createFromRecord(record: db_Condition): Condition {
    return new Condition({
      name: record.name,
      description: record.description ?? undefined,
      maleMating:
        record.maleMating !== null ? Number(record.maleMating) : undefined,
      lethal: record.lethal ?? undefined,
      femaleSterile: record.femaleSterile ?? undefined,
      arrested: record.arrested ?? undefined,
      maturationDays: record.maturationDays ?? undefined,
    });
  }

  @Exclude()
  public generateRecord(): db_Condition {
    return {
      name: this.name,
      description: this.description ?? null,
      maleMating: this.maleMating !== undefined ? this.maleMating : null,
      lethal: this.lethal ?? null,
      femaleSterile: this.femaleSterile ?? null,
      arrested: this.arrested ?? null,
      maturationDays: this.maturationDays ?? null,
    };
  }

  public toJSON(): string {
    return JSON.stringify(instanceToPlain(this));
  }

  static fromJSON(json: string): Condition {
    return [plainToInstance(Condition, JSON.parse(json))].flat()[0];
  }
}
