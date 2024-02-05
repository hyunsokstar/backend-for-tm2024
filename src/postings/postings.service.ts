// postings.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostingDto } from './dtos/create-posting.dto';
import { UserPostingsModel } from './entities/user_postings.entity';
import { UsersModel } from 'src/users/entities/users.entity';
import { UserPostingsDto } from './dtos/userPostingDto.dto';

@Injectable()
export class PostingsService {

    constructor(
        @InjectRepository(UserPostingsModel)
        private postingsRepository: Repository<UserPostingsModel>,
        @InjectRepository(UsersModel)
        private usersRepository: Repository<UsersModel>,
    ) { }

    // async getAllPostings(pageNum: number = 1, perPage: number = 5): Promise<UserPostingsModel[]> {
    async getAllPostings(pageNum: number = 1, perPage: number = 5):
        Promise<{ postings: UserPostingsModel[], totalCount: number, perPage: number }> {

        const skip = (pageNum - 1) * perPage;
        const [postings, totalCount] = await this.postingsRepository.findAndCount({
            skip,
            take: perPage,
            order: {
                id: 'DESC'
            },
            relations: ['user']
        })

        if (!postings || !postings.length) {
            throw new NotFoundException('No Users Found');
        }

        return { postings: postings, totalCount, perPage };
        // return postings
    }

    async createPosting(createPostingDto: CreatePostingDto) {
        console.log("posting service check");

        // CreatePostingDto에서 사용자 ID를 받아올 수 있는지 확인해주세요.
        const { userId, title, content } = createPostingDto;

        // 사용자 ID를 기반으로 사용자 정보를 가져오는 부분입니다.
        const user = await this.usersRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException('User not found'); // 사용자가 없으면 예외 처리합니다.
        }

        const posting = this.postingsRepository.create({
            title,
            content,
            user // 사용자 정보를 추가합니다.
        });

        await this.postingsRepository.save(posting); // 게시물을 저장합니다.
        return posting;
    }

    async deletePosting(postingId: number): Promise<void> {
        await this.postingsRepository.delete(postingId);
    }

    // postings.service.ts

    // ...

    async getUserPostings(
        userId: number,
        pageNum: number = 1,
        perPage: number = 10
    ): Promise<{ user: UsersModel, postings: UserPostingsModel[], totalCount: number, perPage: number }> {

        const user = await this.usersRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const [postings, totalCount] = await this.postingsRepository.findAndCount({
            where: {
                user: { id: userId }
            },
            skip: (pageNum - 1) * perPage,
            take: perPage,
            relations: ['user'], // 이 부분이 추가된 부분입니다. User 정보를 가져오도록 설정합니다.
            order: {
                id: 'DESC'
            }
        });


        return {
            user,
            postings,
            totalCount,
            perPage
        };
    }

    // ...

}