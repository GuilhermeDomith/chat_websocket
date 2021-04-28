import { getCustomRepository, getRepository, Repository } from "typeorm";
import { Message } from "../entities/Message";
import { MessagesRepository } from "../repositories/MessagesRepository";

interface IMessageCreate {
  adminId?: string,
  text: string,
  userId: string;
}

class MessagesService {
  private messagesRepo: Repository<Message>;

  constructor() {
    this.messagesRepo = getCustomRepository(MessagesRepository);
  }

  async create({ adminId, text, userId }: IMessageCreate) {
    const message = this.messagesRepo.create({
      adminId,
      text,
      userId
    });

    return await this.messagesRepo.save(message);
  }

  async listByUser(userId: string) {
    const list = await this.messagesRepo.createQueryBuilder("messages")
      .where("user_id = :userId", { userId })
      .orderBy("created_at")
      .getMany();
    return list;
  }
}

export { MessagesService }