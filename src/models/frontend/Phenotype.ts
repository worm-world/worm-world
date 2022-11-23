import db_Condition from 'models/db/db_Condition';
import db_Phenotype from 'models/db/db_Phenotype';

interface AffectedTraits {
  /** How well the male can mate. 3 denotes max mating capabilities, 0 states worm is incabable of mating  */
  maleMating?: Number;
  lethal?: Boolean;
  femaleSterile?: Boolean;
  /** Worm maturation is stunted */
  arrested?: Boolean;
  /** Generational time for to be ready to breed */
  maturationDays?: Number;
}

interface IPhenotype extends AffectedTraits {
  name: String;
  shortName: String;
  wild: Boolean;
  description?: String;
}

export class Phenotype {
  name: String = '';
  shortName: String = '';
  wild: Boolean = true;
  description?: String;
  maleMating?: Number;
  lethal?: Boolean;
  femaleSterile?: Boolean;
  arrested?: Boolean;
  maturationDays?: Number;

  constructor(fields: IPhenotype) {
    Object.assign(this, fields);
  }

  static createFromRecord(record: db_Phenotype): Phenotype {
    return new Phenotype({
      name: record.name,
      shortName: record.shortName,
      wild: record.wild,
      description: record.description,
      maleMating: record.maleMating,
      lethal: record.lethal,
      femaleSterile: record.femaleSterile,
      arrested: record.arrested,
      maturationDays: record.maturationDays,
    });
  }

  generateRecord = (): db_Phenotype => {
    return {
      name: this.name,
      shortName: this.shortName,
      wild: this.wild,
      description: this.description,
      maleMating: this.maleMating,
      lethal: this.lethal,
      femaleSterile: this.femaleSterile,
      arrested: this.arrested,
      maturationDays: this.maturationDays,
    };
  };
}

interface ICondition extends AffectedTraits {
  name: String;
  description?: String;
}

export class Condition {
  name: String = '';
  description?: String;
  maleMating?: Number;
  lethal?: Boolean;
  femaleSterile?: Boolean;
  arrested?: Boolean;
  maturationDays?: Number;

  constructor(fields: ICondition) {
    Object.assign(this, fields);
  }

  static createFromRecord(record: db_Condition): Condition {
    return new Condition({
      name: record.name,
      description: record.description,
      maleMating: record.maleMating,
      lethal: record.lethal,
      femaleSterile: record.femaleSterile,
      arrested: record.arrested,
      maturationDays: record.maturationDays,
    });
  }

  generateRecord = (): db_Condition => {
    return {
      name: this.name,
      description: this.description,
      maleMating: this.maleMating,
      lethal: this.lethal,
      femaleSterile: this.femaleSterile,
      arrested: this.arrested,
      maturationDays: this.maturationDays,
    };
  };
}
