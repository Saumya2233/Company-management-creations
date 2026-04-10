import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';

@Injectable()
export class CompaniesService {
    constructor(
        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>,
    ) { }

    async getAllCompanies() {
        return this.companyRepository.find({
            order: { created_at: 'DESC' },
        });
    }

    async createCompany(name: string, userId: string) {
        const company = this.companyRepository.create({
            name,
            created_by: userId,
        });

        return this.companyRepository.save(company);
    }
}