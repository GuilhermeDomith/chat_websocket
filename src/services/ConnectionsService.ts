import { getCustomRepository, Repository } from "typeorm";
import { Connection } from "../entities/Connection";
import { ConnectionsRepository } from "../repositories/ConnectionsRepository";

interface IConnectionCreate {
  socketId: string,
  userId: string,
  adminId?: string,
  id?: string,
}

interface IUpdateAdminId {
  userId: string,
  adminId: string
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

  async findAllWithoutAdmin(): Promise<Connection[]> {
    const connections = await this.connectionsRepo.find({
      where: { adminId: null },
      relations: ["user"]
    })

    return connections;
  }

  async findBySockedId(socketId: string): Promise<Connection> {
    const connection = await this.connectionsRepo.findOne({
      socketId
    });

    return connection;
  }

  async updateAdminId({ userId, adminId }: IUpdateAdminId) {
    await this.connectionsRepo
      .createQueryBuilder()
      .update(Connection)
      .set({ adminId })
      .where("user_id = :userId", { userId })
      .execute();
  }
}

export { ConnectionsService };