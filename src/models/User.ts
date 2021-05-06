import Joi from 'joi';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

    dateOfBirth: Joi
      .date()
      .required(),

    username: Joi
      .string()
      .max(15)
      .required()
  })
  .xor('email', 'phone');

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email?: string;

  @Column()
  phone?: string;

  @Column()
  password!: string;

  @Column({ name: 'date_of_birth' })
  dateOfBirth!: Date;

  @Column()
  username!: string;

  @Column()
  bio?: string;

  @Column({ name: 'profile_picture_url' })
  profilePictureUrl?: string;

  @Column({ name: 'background_picture_url' })
  backgroundPictureUrl?: string;

  @Column()
  location?: string;

  @Column({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'disabled_at' })
  disabledAt?: Date;

  public constructor(
    name: string,
    password: string,
    dateOfBirth: string,
    username: string,
    email?: string,
    phone?: string
  ) {
    this.name = name;
    this.password = password;
    this.dateOfBirth = new Date(dateOfBirth);
    this.username = username;
    this.email = email;
    this.phone = phone;
  }
}
