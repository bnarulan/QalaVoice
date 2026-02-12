"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EgovService = void 0;
const common_1 = require("@nestjs/common");
let EgovService = class EgovService {
    constructor() {
        this.baseUrl = 'https://data.egov.kz';
    }
    async verifyIin(iin) {
        try {
            const apiKey = process.env.EGOV_API_KEY;
            if (!apiKey) {
                return { valid: iin.length === 12 && /^\d+$/.test(iin) };
            }
            const url = `${this.baseUrl}/api/v4/nsad/full?iin=${iin}&apikey=${apiKey}`;
            const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
            const data = await res.json();
            return { valid: !!data, fullName: data?.fullName };
        }
        catch {
            return { valid: iin.length === 12 && /^\d+$/.test(iin) };
        }
    }
};
exports.EgovService = EgovService;
exports.EgovService = EgovService = __decorate([
    (0, common_1.Injectable)()
], EgovService);
//# sourceMappingURL=egov.service.js.map