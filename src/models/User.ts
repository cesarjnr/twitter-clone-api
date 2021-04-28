import Joi from 'joi';
import { Model } from 'objection';

export const createUserValidatorSchema = Joi
  .object({
    name: Joi
      .string()
      .required(),

    email: Joi
      .string()
      .email(),

    phone: Joi
      .string(),

    password: Joi
      .string()
      .required(),

    dateOfBirth: Joi
      .date()
      .required(),

    username: Joi
      .string()
      .required()
  })
  .xor('email', 'phone');

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
