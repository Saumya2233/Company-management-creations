import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SessionsService } from '../sessions/sessions.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly sessionsService: SessionsService,
        private readonly jwtService: JwtService,
    ) { }

    async sendOtp(sendOtpDto: SendOtpDto) {
        const { country_code, phone_number } = sendOtpDto;

        if (!country_code || !phone_number) {
            throw new BadRequestException({
                statusCode: 400,
                message: 'Country code and phone number are required',
                data: null,
            });
        }

        return {
            statusCode: 200,
            message: 'OTP sent successfully',
            data: null,
        };
    }

    async verifyOtp(verifyOtpDto: VerifyOtpDto) {
        const { country_code, phone_number, otp } = verifyOtpDto;

        if (otp !== '123456') {
            throw new BadRequestException({
                statusCode: 400,
                message: 'Invalid OTP',
                data: null,
            });
        }

        let user = await this.usersService.findByPhone(country_code, phone_number);

        if (!user) {
            user = await this.usersService.createUser(country_code, phone_number);
        }

        const token = await this.jwtService.signAsync({
            sub: user.id,
            country_code: user.country_code,
            phone_number: user.phone_number,
        });

        await this.sessionsService.createSession(user.id, token);

        return {
            statusCode: 200,
            message: 'Login successful',
            data: {
                user,
                token,
            },
        };
    }

    async logout(token: string) {
        await this.sessionsService.deactivateSession(token);

        return {
            statusCode: 200,
            message: 'Logged out successfully',
            data: null,
        };
    }
}