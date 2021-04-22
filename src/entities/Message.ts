import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import { User } from "./User";


@Entity("messages")
class Message {

  @PrimaryColumn()
  id: string;
  
  @Column({name: "admin_id"})
  adminId: string;

  @Column()
  text: string;

  @Column({name: "user_id"})
  userId: string;

  @CreateDateColumn({name: "created_at"})
  createdAt: Date;

  @JoinColumn({ name: "user_id" })
  @ManyToOne(() => User)
  user: User;

  constructor() {
    if(!this.id) {
      this.id = uuid();
    }
  }
}

export { Message }