
export enum IBLOOD_TYPE_ENUM {
  APositive = 'A positive (A+)',
  ANegative = 'A negative (A-)',
  BPositive = 'B positive (B+)',
  BNegative = 'B negative (B-)',
  ABPositive = 'AB positive (AB+)',
  ABNegative = 'AB negative (AB-)',
  OPositive = 'O positive (O+)',
  ONegative ='O negative (O-)',
}
export interface IBloodType {
  id: number;
  name: IBLOOD_TYPE_ENUM;
}

export class BloodType implements IBloodType{
  id: number;

  name: IBLOOD_TYPE_ENUM;

  public constructor(id: number, name: IBLOOD_TYPE_ENUM) {
    this.id = id;
    this.name = name;
  }
}
