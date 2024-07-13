import {BadRequestException, Injectable, InternalServerErrorException, Logger} from '@nestjs/common';
import {BearRepository} from "../persistence/bear.repository";
import { Bear } from '../persistence/bear.entity';


@Injectable()
export class BearService {
    private readonly logger = new Logger(BearService.name);


    constructor(private readonly bearRepository: BearRepository) {
    }

    async findBearBySizeInRange(start: number, end: number): Promise<string[]> {
        const bears = await this.bearRepository.findBearBySizeInRange(start, end);
        return bears.map(bear => bear.name);
    }

    async findBearsByColor(colorName: string): Promise<string[]> {
        
        try {
          const bears = await this.bearRepository.findBearsByColor(colorName);
          if (!bears.length) {
            return [];
          }
    
          return bears.map(bear => bear.name);
        } catch (error) {
          this.logger.error(`Failed to find bears by color ${colorName}: ${error.message}`);
          throw new InternalServerErrorException('An unexpected error occurred while fetching bears by color.');
        }
      }
      
}
