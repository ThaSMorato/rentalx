import { Expose } from "class-transformer";
import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";

const ENV_URL = {
  LOCAL: `${process.env.API_URL}/avatar/`,
  S3: `${process.env.AWS_BUCKET_URL}/avatar/`,
};

@Entity("users")
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  driver_license: string;

  @Column()
  isAdmin: boolean;

  @Column()
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }

  @Expose({ name: "avatar_url" })
  avatar_url(): string {
    return `${ENV_URL[process.env.DISK]}${this.avatar}`;
  }
}
