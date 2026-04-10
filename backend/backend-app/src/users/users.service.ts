import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async findByPhone(country_code: string, phone_number: string) {
        return this.userRepository.findOne({
            where: { country_code, phone_number },
        });
    }

    async createUser(country_code: string, phone_number: string) {
        const user = this.userRepository.create({
            country_code,
            phone_number,
        });

        return this.userRepository.save(user);
    }

    async findById(id: string) {
        return this.userRepository.findOne({
            where: { id },
        });
    }
}