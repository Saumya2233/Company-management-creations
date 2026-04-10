import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';

@Injectable()
export class SessionsService {
    constructor(
        @InjectRepository(Session)
        private readonly sessionRepository: Repository<Session>,
    ) { }

    async createSession(user_id: string, jwt_token: string) {
        const expiredAt = new Date();
        expiredAt.setDate(expiredAt.getDate() + 7);

        const session = this.sessionRepository.create({
            user_id,
            jwt_token,
            is_active: true,
            expired_at: expiredAt,
        });

        return this.sessionRepository.save(session);
    }

    async findActiveSessionByToken(jwt_token: string) {
        return this.sessionRepository.findOne({
            where: {
                jwt_token,
                is_active: true,
            },
        });
    }

    async deactivateSession(jwt_token: string) {
        await this.sessionRepository.update(
            { jwt_token, is_active: true },
            { is_active: false },
        );
    }
}