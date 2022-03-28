import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 20 })
  username: string;

  @Column({ length: 60 })
  password: string;

  @Column()
  avatar: string;

  @Column({ default: false })
  is_admin: boolean;
}

export default User;
