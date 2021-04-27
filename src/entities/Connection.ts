import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn
} from "typeorm";
import { v4 as uuid } from "uuid";
import { User } from "./User";

@Entity("connections")
class Connection {
  @PrimaryColumn()
  id: string;

  @Column({ name: "admin_id" })
  adminId: string;

  @Column({ name: "socket_id" })
  socketId: string;

  @Column({ name: "user_id" })
  userId: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @JoinColumn({ name: "user_id" })
  @ManyToOne(() => User)
  user: User;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export { Connection }