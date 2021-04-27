import { getCustomRepository, Repository } from "typeorm";
import { Setting } from "../entities/Setting";
import { SettingsRepository } from "../repositories/SettingsRepository";


interface ISettingsCreate {
  chat: boolean;
  username: string;
}

interface ISettingsUpdate {
  chat: boolean;
  username: string;
}

class SettingsService {
  private settingsRepo: Repository<Setting>;

  constructor() {
    this.settingsRepo = getCustomRepository(SettingsRepository);
  }

  async create({ chat, username }: ISettingsCreate) {
    const userAlreadyExists = await this.settingsRepo.findOne({ username })

    if (userAlreadyExists) {
      throw new Error("User already exists!");
    }

    const settings = this.settingsRepo.create({
      chat,
      username
    });

    return await this.settingsRepo.save(settings);
  }

  async findByUsername(username: string) {
    const settings = await this.settingsRepo.findOne({
      username
    });

    return settings;
  }

  async update({ username, chat }: ISettingsUpdate) {
    await this.settingsRepo.createQueryBuilder()
      .update(Setting)
      .set({ chat })
      .where("username = :username", { username })
      .execute();
  }
}

export { SettingsService };