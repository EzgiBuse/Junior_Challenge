"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const integration_test_module_1 = require("../integration-test.module");
const bear_repository_1 = require("../persistence/bear.repository");
const data_source_1 = require("../config/data-source");
const typeorm_transactional_tests_1 = require("typeorm-transactional-tests");
const bear_controller_1 = require("./bear.controller");
const bear_entity_1 = require("../persistence/bear.entity");
const common_1 = require("@nestjs/common");
const bear_service_1 = require("../service/bear.service");
const color_entity_1 = require("../persistence/color.entity");
jest.setTimeout(60000);
let transactionalContext;
let testModule;
let bearRepository;
let bearController;
let bearService;
describe('BearController', () => {
    beforeAll(async () => {
        testModule = await (0, integration_test_module_1.integrationTestModule)();
        bearRepository = testModule.get(bear_repository_1.BearRepository);
        bearController = testModule.get(bear_controller_1.BearController);
        bearService = testModule.get(bear_service_1.BearService);
    });
    afterAll(async () => {
        await (0, integration_test_module_1.integrationTestTeardown)();
    });
    beforeEach(async () => {
        if (data_source_1.AppDataSource.isInitialized) {
            transactionalContext = new typeorm_transactional_tests_1.TransactionalTestContext(data_source_1.AppDataSource);
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
            await bearController.getBearBySizeInRange(10, 0);
        }
        catch (error) {
            const exception = error;
            expect(exception.getStatus()).toEqual(400);
        }
    });
    it('size-in-range should return proper values', async () => {
        const gummyBear = new bear_entity_1.Bear();
        gummyBear.name = 'Gummybear';
        gummyBear.size = 5;
        const grizzlyBear = new bear_entity_1.Bear();
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
    it('by-color with empty color parameter should raise error', async () => {
        try {
            await bearController.getBearsByColor(' ');
        }
        catch (error) {
            expect(error).toBeInstanceOf(common_1.BadRequestException);
            expect(error.getStatus()).toEqual(400);
            expect(error.message).toEqual('Color parameter is required.');
        }
    });
    it('by-color with correct color should return proper values', async () => {
        const brownColor = new color_entity_1.Color();
        brownColor.name = 'Brown';
        await data_source_1.AppDataSource.manager.save(brownColor);
        const brownBear = new bear_entity_1.Bear();
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
    it('by-color should handle BadRequestException from service', async () => {
        jest.spyOn(bearService, 'findBearsByColor').mockImplementation(async () => {
            throw new common_1.BadRequestException('Invalid color');
        });
        try {
            await bearController.getBearsByColor('InvalidColor');
        }
        catch (error) {
            expect(error).toBeInstanceOf(common_1.BadRequestException);
            expect(error.getStatus()).toEqual(400);
        }
    });
    it('by-color should handle InternalServerErrorException from service', async () => {
        jest.spyOn(bearService, 'findBearsByColor').mockImplementation(async () => {
            throw new Error('Some unexpected error');
        });
        try {
            await bearController.getBearsByColor('SomeColor');
        }
        catch (error) {
            expect(error).toBeInstanceOf(common_1.InternalServerErrorException);
            expect(error.getStatus()).toEqual(500);
        }
    });
});
//# sourceMappingURL=bear.controller.spec.js.map