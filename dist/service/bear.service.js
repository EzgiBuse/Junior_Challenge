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
var BearService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BearService = void 0;
const common_1 = require("@nestjs/common");
const bear_repository_1 = require("../persistence/bear.repository");
let BearService = BearService_1 = class BearService {
    constructor(bearRepository) {
        this.bearRepository = bearRepository;
        this.logger = new common_1.Logger(BearService_1.name);
    }
    async findBearBySizeInRange(start, end) {
        const bears = await this.bearRepository.findBearBySizeInRange(start, end);
        return bears.map(bear => bear.name);
    }
    async findBearsByColor(colorName) {
        try {
            const bears = await this.bearRepository.findBearsByColor(colorName);
            if (!bears.length) {
                return [];
            }
            return bears.map(bear => bear.name);
        }
        catch (error) {
            this.logger.error(`Failed to find bears by color ${colorName}: ${error.message}`);
            throw new common_1.InternalServerErrorException('An unexpected error occurred while fetching bears by color.');
        }
    }
};
exports.BearService = BearService;
exports.BearService = BearService = BearService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [bear_repository_1.BearRepository])
], BearService);
//# sourceMappingURL=bear.service.js.map