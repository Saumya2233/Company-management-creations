import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateCompanyDto } from './dto/create-company.dto';

@Controller('companies')
export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getCompanies() {
        const companies = await this.companiesService.getAllCompanies();

        return {
            statusCode: 200,
            message: 'Companies fetched successfully',
            data: companies,
        };
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createCompany(
        @Body() createCompanyDto: CreateCompanyDto,
        @Req() req: any,
    ) {
        const company = await this.companiesService.createCompany(
            createCompanyDto.name,
            req.user.sub,
        );

        return {
            statusCode: 201,
            message: 'Company created successfully',
            data: company,
        };
    }
}