export enum IGENDER_TYPE {
    Male = 'Male',
    Female = 'Female',
    Other = 'Other',
}
export interface IGender {
  id: number;
  name: IGENDER_TYPE;
}

export class Gender implements IGender{
  id: number;

  name: IGENDER_TYPE;

  public constructor(id: number, name: IGENDER_TYPE) {
    this.id = id;
    this.name = name;
  }
}