import { IBloodType } from "./bloodType";
import { IEducationalCertificate } from "./educationalCertificate";
import { IGender } from "./gender";

export enum IUSER_TYPE {
  ADMIN = "ADMIN",
  REGULAR_USER = "REGULAR_USER",
  NONE = "NONE"
}
export interface IUserProfile {
  id: number;
  email: string;
  name: string;
  isApproved: boolean;
  emailVerifiedAt: string;
  userType: IUSER_TYPE;
  bloodType: IBloodType;
  gender: IGender;
  roleAssignmentDate: string;
  createdAt: string;
  updatedAt: string;
  educationalCertificates?: IEducationalCertificate[];
}
export interface IUsersTable extends IUserProfile{
  isEditing: boolean;
  [key: string]: any;// Index signature to allow indexing with a string (there was an error in "row[property]")
}
export interface IRegularUser {
  id: number;
  email: string;
  name: string;
  isApproved: boolean;
  emailVerifiedAt: string;
  bloodType: IBloodType;
  gender: IGender;
  roleAssignmentDate: string;
  createdAt: string;
  updatedAt: string;
}
export interface IEditUserForm {
  email: string;
  name: string;
  bloodTypeId: number;
  genderId: number;
}