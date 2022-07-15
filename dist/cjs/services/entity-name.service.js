"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityNameService = void 0;
const rxjs_1 = require("rxjs");
const configuration_entity_model_1 = require("../models/entities/configuration-entity.model");
class EntityNameService {
    constructor(httpService) {
        this.httpService = httpService;
        this._nameCache = {};
    }
    resolveEntityPath(entityType, id, includeSelf = false, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = yield this.httpService.getPartialEntityById(entityType, id, { Name: 1, Path: 1 });
            let path = yield this.resolvePathName(entity.Path.splice(limit ? entity.Path.length - limit : 0, entity.Path.length));
            if (includeSelf) {
                path = path + '/' + entity.Name.Value;
            }
            return path;
        });
    }
    resolvePathName(idPath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (idPath.length === 0) {
                return '';
            }
            return (0, rxjs_1.firstValueFrom)((0, rxjs_1.combineLatest)(idPath.map((id) => this.resolveName(configuration_entity_model_1.EntityType.Group, id))).pipe((0, rxjs_1.map)((names) => names.join(' / '))));
        });
    }
    resolveName(entityType, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._nameCache[id]) {
                this._nameCache[id] = (0, rxjs_1.from)(this.httpService.getPartialEntityById(entityType, id, { Name: 1 })).pipe((0, rxjs_1.map)((x) => x.Name.Value), (0, rxjs_1.shareReplay)(1), (0, rxjs_1.catchError)(() => (0, rxjs_1.of)(id)));
            }
            return (0, rxjs_1.firstValueFrom)(this._nameCache[id]);
        });
    }
}
exports.EntityNameService = EntityNameService;
