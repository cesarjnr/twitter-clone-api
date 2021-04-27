import { Model } from 'objection';

export class User extends Model {
  id!: number;
  name!: string;
  email?: string;
  phone?: string;
  password!: string;
  dateOfBirth!: Date;
  username!: string;
  bio?: string;
  profilePictureUrl?: string;
  backgroundPictureUrl?: string;
  location?: string;
  createdAt!: Date;
  disabledAt?: Date;

  static get tableName() {
    return 'users';
  }
}
