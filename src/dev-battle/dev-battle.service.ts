import { Injectable } from '@nestjs/common';
import { UpdateDevBattleDto } from './dto/update-dev-battle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DevBattle } from './entities/dev-battle.entity';
import { Repository } from 'typeorm';
import { CreateDevBattleDto } from './dto/create-dev-battle.dto';
import { TagForDevBattle } from './entities/tag.entity';

@Injectable()
export class DevBattleService {

  constructor(
    @InjectRepository(DevBattle)
    private devBattleRepo: Repository<DevBattle>,
    @InjectRepository(TagForDevBattle)
    private tagForDevBattleRepo: Repository<TagForDevBattle>,
  ) { }

  async addTagToDevBattle(devBattleId: number, textForTag: string): Promise<DevBattle> {
    const devBattle = await this.devBattleRepo.findOne({
      where: { id: devBattleId },
      relations: ['tags'],
    });

    if (!devBattle) {
      throw new Error('DevBattle not found');
    }

    let tag = await this.tagForDevBattleRepo.findOne({ where: { name: textForTag } });

    if (!tag) {
      // Create a new tag if it doesn't exist
      tag = new TagForDevBattle();
      tag.name = textForTag;
      tag = await this.tagForDevBattleRepo.save(tag);
    }

    devBattle.tags.push(tag);
    return await this.devBattleRepo.save(devBattle);
  }

  async findAllDevBattle(): Promise<DevBattle[]> {
    // Eager loading to fetch tags along with DevBattle entities
    // Order by ID in ascending order
    return await this.devBattleRepo.find({ relations: ['tags'], order: { id: 'ASC' } });
  }

  async bulkCreateDevBattles(subjects: string[]): Promise<DevBattle[]> {
    const devBattles: DevBattle[] = [];

    for (const subject of subjects) {
      const devBattle = new DevBattle();
      devBattle.subject = subject;
      devBattles.push(devBattle);
    }

    return await this.devBattleRepo.save(devBattles);
  }

  async createDevBattle(createDevBattleDto: CreateDevBattleDto): Promise<DevBattle> {
    const devBattle = new DevBattle();
    devBattle.subject = createDevBattleDto.subject;
    return await this.devBattleRepo.save(devBattle);
  }

  findOne(id: number) {
    return `This action returns a #${id} devBattle`;
  }

  update(id: number, updateDevBattleDto: UpdateDevBattleDto) {
    return `This action updates a #${id} devBattle`;
  }

  remove(id: number) {
    return `This action removes a #${id} devBattle`;
  }
}
