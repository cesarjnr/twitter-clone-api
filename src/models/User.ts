import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name: string;

  @Column({ type: 'varchar' })
  email?: string | null;

  @Column({ type: 'varchar' })
  phone?: string;

  @Column()
  password: string;

  @Column({ name: 'date_of_birth' })
  dateOfBirth: Date;

  @Column()
  username: string;

  @Column({ type: 'varchar' })
  bio?: string | null;

  @Column({ name: 'profile_picture_url', type: 'varchar' })
  profilePictureUrl?: string | null;

  @Column({ name: 'background_picture_url', type: 'varchar' })
  backgroundPictureUrl?: string | null;

  @Column({ type: 'varchar' })
  location?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'disabled_at', type: 'varchar' })
  disabledAt?: Date | null;

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
