import {integrationTestModule, integrationTestTeardown} from "../integration-test.module";
import {BearRepository} from "../persistence/bear.repository";
import {AppDataSource} from "../config/data-source";
import {TransactionalTestContext} from "typeorm-transactional-tests";
import {BearController} from "./bear.controller";
import {Bear} from "../persistence/bear.entity";
import {BadRequestException, InternalServerErrorException} from "@nestjs/common";
import { BearService } from "../service/bear.service";
import { Color } from "../persistence/color.entity";

jest.setTimeout(60000);

let transactionalContext: TransactionalTestContext;
let testModule;
let bearRepository: BearRepository;
let bearController: BearController;
let bearService: BearService;

describe('BearController', () => {
    beforeAll(async () => {
        testModule = await integrationTestModule();
        bearRepository = testModule.get<BearRepository>(BearRepository);
        bearController = testModule.get<BearController>(BearController);
        bearService = testModule.get<BearService>(BearService);
    });

    afterAll(async () => {
        await integrationTestTeardown();
    });

    beforeEach(async () => {
        if (AppDataSource.isInitialized) {
            transactionalContext = new TransactionalTestContext(AppDataSource);
            await transactionalContext.start();
        }
    });

    afterEach(async () => {
        if (transactionalContext) {
            await transactionalContext.finish();
        }
    });

    it('Should run', async () => {
        expect(bearRepository).toBeDefined();
    });

    it('size-in-range wrong parameters should raise error', async () => {
        try {
            await bearController.getBearBySizeInRange(10, 0)
        } catch (error) {
            const exception = error as BadRequestException;
            expect(exception.getStatus()).toEqual(400);
        }
    });

    it('size-in-range should return proper values', async () => {
        const gummyBear = new Bear();
        gummyBear.name = 'Gummybear';
        gummyBear.size = 5;
        const grizzlyBear = new Bear();
        grizzlyBear.name = 'Grizzly';
        grizzlyBear.size = 320;
        await bearRepository.save(gummyBear);
        await bearRepository.save(grizzlyBear);

        let bears = await bearController.getBearBySizeInRange(0, 4);
        expect(bears.length).toEqual(0);

        bears = await bearController.getBearBySizeInRange(5, 320);
        expect(bears.length).toEqual(2);

        bears = await bearController.getBearBySizeInRange(100, 500);
        expect(bears.length).toEqual(1);
        expect(bears[0]).toEqual('Grizzly');
    });

     //Tests for by-color
     it('by-color with empty color parameter should raise error', async () => {
        try {
          await bearController.getBearsByColor(' ');
        } catch (error) {
          expect(error).toBeInstanceOf(BadRequestException);
          expect((error as BadRequestException).getStatus()).toEqual(400);
          expect((error as BadRequestException).message).toEqual('Color parameter is required.');
        }
      });
    
      it('by-color with correct color should return proper values', async () => {
        const brownColor = new Color();
        brownColor.name = 'Brown';
        await AppDataSource.manager.save(brownColor);
    
        const brownBear = new Bear();
        brownBear.name = 'Brown Bear';
        brownBear.size = 250;
        brownBear.colors = [brownColor];
        await bearRepository.save(brownBear);
    
        const bears = await bearController.getBearsByColor('Brown');
        expect(bears.length).toEqual(1);
        expect(bears[0]).toEqual('Brown Bear');
      });
    
    
      it('by-color should return empty array for non-existing color', async () => {
        const bears = await bearController.getBearsByColor('NonExistentColor');
        expect(bears.length).toEqual(0);
      });
    
    
      it('by-color should handle InternalServerErrorException', async () => {
        // Unexpected error in the service layer
        jest.spyOn(bearService, 'findBearsByColor').mockImplementation(async () => {
          throw new Error('Some unexpected error');
        });
    
        try {
          await bearController.getBearsByColor('SomeColor');
        } catch (error) {
          expect(error).toBeInstanceOf(InternalServerErrorException);
          expect((error as InternalServerErrorException).getStatus()).toEqual(500);
        }
      });
    });
