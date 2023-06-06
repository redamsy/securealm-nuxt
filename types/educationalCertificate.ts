import { IUserProfile } from "./user";

export interface IEducationalCertificate {
  id: number;
  name: string;
  isDeletable: boolean;
}
export interface IEducationalCertificateIncludeUsers extends IEducationalCertificate {
  regularUsers: IUserProfile[];
}
export interface IRuecsTable extends IEducationalCertificateIncludeUsers{
  isEditing: boolean;
  [key: string]: any;// Index signature to allow indexing with a string (there was an error in "row[property]")
}

export type IRuecNewRowTable = Pick<IRuecsTable, "id" | "name" >