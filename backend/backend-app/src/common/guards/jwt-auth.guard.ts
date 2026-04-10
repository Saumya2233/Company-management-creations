import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SessionsService } from '../../sessions/sessions.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly sessionsService: SessionsService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest() as any;
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException({
                statusCode: 401,
                message: 'Token missing',
                data: null,
            });
        }

        const token = authHeader.split(' ')[1];

        let decoded: any;

        try {
            decoded = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });
        } catch {
            throw new UnauthorizedException({
                statusCode: 401,
                message: 'Invalid token',
                data: null,
            });
        }

        const session = await this.sessionsService.findActiveSessionByToken(token);

        if (!session) {
            throw new UnauthorizedException({
                statusCode: 401,
                message: 'Session expired or invalid',
                data: null,
            });
        }

        request.user = decoded;
        return true;
    }
}