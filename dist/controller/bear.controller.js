"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var BearController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BearController = void 0;
const common_1 = require("@nestjs/common");
const bear_service_1 = require("../service/bear.service");
let BearController = BearController_1 = class BearController {
    constructor(bearService) {
        this.bearService = bearService;
        this.logger = new common_1.Logger(BearController_1.name);
    }
    getBearBySizeInRange(start, end) {
        if (start > end) {
            throw new common_1.BadRequestException(`Start ${start} is larger than end ${end}`);
        }
        return this.bearService.findBearBySizeInRange(start, end);
    }
    async getBearsByColor(color) {
        if (!color || color.trim() === '') {
            this.logger.error('Color parameter is required.');
            throw new common_1.BadRequestException('Color parameter is required.');
        }
        try {
            const bears = await this.bearService.findBearsByColor(color);
            this.logger.log(`Retrieved bears for color ${color}: ${bears.join(', ')}`);
            return bears;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                this.logger.error(`BadRequestException: ${error.message}`);
                throw error;
            }
            this.logger.error(`InternalServerErrorException: ${error.message}`);
            throw new common_1.InternalServerErrorException('An unexpected error occurred while fetching bears by color.');
        }
    }
};
exports.BearController = BearController;
__decorate([
    (0, common_1.Get)('size-in-range/:start/:end'),
    __param(0, (0, common_1.Param)('start')),
    __param(1, (0, common_1.Param)('end')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], BearController.prototype, "getBearBySizeInRange", null);
__decorate([
    (0, common_1.Get)('by-color/:color'),
    __param(0, (0, common_1.Param)('color')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BearController.prototype, "getBearsByColor", null);
exports.BearController = BearController = BearController_1 = __decorate([
    (0, common_1.Controller)('bear'),
    __metadata("design:paramtypes", [bear_service_1.BearService])
], BearController);
//# sourceMappingURL=bear.controller.js.map