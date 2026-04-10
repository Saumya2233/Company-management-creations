import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { SessionsModule } from '../sessions/sessions.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    SessionsModule,   // 🔥 needed
    AuthModule,       // 🔥 needed for JwtService
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule { }