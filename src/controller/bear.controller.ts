import {BadRequestException, Controller, Get, InternalServerErrorException, Logger, Param} from '@nestjs/common';
import { BearService } from '../service/bear.service';

@Controller('bear')
export class BearController {
    
    private readonly logger = new Logger(BearController.name);

    constructor(private readonly bearService: BearService) {}

    @Get('size-in-range/:start/:end')
    getBearBySizeInRange(
        @Param('start') start: number,
        @Param('end') end: number
    ): Promise<string[]> {

        if (start > end) {
            throw new BadRequestException(`Start ${start} is larger than end ${end}`);
        }

        return this.bearService.findBearBySizeInRange(start, end);
    }

    @Get('by-color/:color')
    async getBearsByColor(@Param('color') color: string): Promise<string[]> {

        if (!color || color.trim() === '') {
            this.logger.error('Color parameter is required.');
            throw new BadRequestException('Color parameter is required.');
          }
      
    try {
      const bears = await this.bearService.findBearsByColor(color);
      this.logger.log(`Retrieved bears for color ${color}: ${bears.join(', ')}`);
      return bears;
    } catch (error) {
      if (error instanceof BadRequestException) {
        this.logger.error(`BadRequestException: ${error.message}`);
        throw error;
      }
      this.logger.error(`InternalServerErrorException: ${error.message}`);
      throw new InternalServerErrorException('An unexpected error occurred while fetching bears by color.');
    }
  }

  

}
