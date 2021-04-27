import { getCustomRepository, Repository } from "typeorm";
import { Connection } from "../entities/Connection";
import { ConnectionsRepository } from "../repositories/ConnectionsRepository";

interface IConnectionCreate {
  socketId: string,
  userId: string,
  adminId?: string,
  id?: string,
}

class ConnectionsService {
  private connectionsRepo: Repository<Connection>;

  constructor() {
    this.connectionsRepo = getCustomRepository(ConnectionsRepository);
  }

  async create({ socketId, userId, adminId, id }: IConnectionCreate): Promise<Connection> {
    const connection = this.connectionsRepo.create({
      socketId, userId, adminId, id
    });

    await this.connectionsRepo.save(connection);
    return connection;
  }

  async findByUserId(userId: string): Promise<Connection> {
    const connection = await this.connectionsRepo.findOne({
      userId
    });

    return connection;
  }
}

export { ConnectionsService };