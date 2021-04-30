import Joi from 'joi';
import { Model } from 'objection';

export const createUserValidatorSchema = Joi
  .object({
    name: Joi
      .string()
      .max(50)
      .required(),

    email: Joi
      .string()
      .email(),

    phone: Joi
      .string(),

    password: Joi
      .string()
      .min(6)
      .max(16)
      .required(),

    date_of_birth: Joi
      .date()
      .required(),

    username: Joi
      .string()
      .max(15)
      .required()
  })
  .xor('email', 'phone');

export class User extends Model {
  id!: number;
  name!: string;
  email?: string;
  phone?: string;
  password!: string;
  date_of_birth!: Date;
  username!: string;
  bio?: string;
  profile_picture_url?: string;
  background_picture_url?: string;
  location?: string;
  created_at!: Date;
  disabled_at?: Date;

  static get tableName() {
    return 'users';
  }
}
