import {Between, DataSource, Repository} from 'typeorm';
import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {Bear} from "./bear.entity";

@Injectable()
export class BearRepository extends Repository<Bear> {
    constructor(readonly dataSource: DataSource) {
        super(Bear, dataSource.createEntityManager());
    }

    async findBearBySizeInRange(start: number, end: number): Promise<Bear[]> {
        return this.find({
            where: {
                size: Between(start, end)
            }
        });
    }

    async findBearsByColor(colorName: string): Promise<Bear[]> {
        try {
          return await this.find({
            relations: ['colors'],
            where: {
              colors: {
                name: colorName
              }
            }
          });
        } catch (error) {
          throw new InternalServerErrorException('Failed to find bears by color.');
        }
      }
    

}



export const BearRepositoryProvider = {
    provide: BearRepository,
    useFactory: (dataSource: DataSource): BearRepository =>
        new BearRepository(dataSource),
    inject: [DataSource]
};
