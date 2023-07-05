import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class TKKill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, default: "", comment: "name" })
  name: string;

  @Column({ length: 100, default: "", comment: "userId" })
  userId: string;

  @Column({ length: 255, default: "", comment: "avatar" })
  avatar: string;

  @Column({ length: 100, default: "", comment: "socketId" })
  socketId: string;

  @CreateDateColumn({
    type: "timestamp",
    comment: "创建时间",
  })
  create_at: number;

  @UpdateDateColumn({
    type: "timestamp",
    comment: "更新时间",
  })
  update_at: number;
}
