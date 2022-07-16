var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { catchError, combineLatest, firstValueFrom, from, map, of, shareReplay } from 'rxjs';
import { EntityType } from '../models/entities/configuration-entity.model.js';
export class EntityNameService {
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
            return firstValueFrom(combineLatest(idPath.map((id) => this.resolveName(EntityType.Group, id))).pipe(map((names) => names.join(' / '))));
        });
    }
    resolveName(entityType, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._nameCache[id]) {
                this._nameCache[id] = from(this.httpService.getPartialEntityById(entityType, id, { Name: 1 })).pipe(map((x) => x.Name.Value), shareReplay(1), catchError(() => of(id)));
            }
            return firstValueFrom(this._nameCache[id]);
        });
    }
}
