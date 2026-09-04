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
import { EntityType, Field } from '../models/entities/configuration-entity.model.js';
/** Reads the plain name out of an `entity-info` name field, which may be a `Field` or a string. */
function nameOf(value) {
    return Field.isField(value) ? value.Value : value;
}
export class EntityNameService {
    constructor(httpService) {
        this.httpService = httpService;
        this._nameCache = {};
    }
    resolveEntityPath(entityType, id, includeSelf = false, limit, separator = ' / ') {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = yield this.httpService.getPartialEntityById(entityType, id, { Name: 1, Path: 1 });
            let path = yield this.resolvePathName(entity.Path.splice(limit ? entity.Path.length - limit : 0, entity.Path.length), separator);
            if (includeSelf) {
                path = path + separator + entity.Name.Value;
            }
            return path;
        });
    }
    resolvePathName(idPath, separator = ' / ') {
        return __awaiter(this, void 0, void 0, function* () {
            if (idPath.length === 0) {
                return '';
            }
            const names = yield this.resolveNames(EntityType.Group, idPath);
            return names.join(separator);
        });
    }
    resolveName(entityType, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const names = yield this.resolveNames(entityType, [id]);
            return names[0];
        });
    }
    /**
     * Names of several entities of one type, in the order of `ids`. Unresolvable ids resolve to the
     * id itself. Names are cached per id for the lifetime of the service.
     *
     * On v5 the uncached ids are fetched with a single `entity-info` request
     * (`supports('entityInfo')`); on v4 one projected `GET` per id is issued, as before.
     */
    resolveNames(entityType, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const missing = ids.filter((id) => !this._nameCache[id]);
            if (missing.length > 0) {
                const versionInfo = yield this.httpService.getVersionInfo();
                if (versionInfo.supports('entityInfo')) {
                    yield this._cacheFromEntityInfo(entityType, missing);
                }
                for (const id of missing) {
                    this._cacheSingle(entityType, id);
                }
            }
            return firstValueFrom(combineLatest(ids.map((id) => this._nameCache[id])));
        });
    }
    /** Fills the cache from one `entity-info` request. Ids the platform did not return stay uncached. */
    _cacheFromEntityInfo(entityType, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            let infos = [];
            try {
                infos = yield this.httpService.getEntityInfosByIds(entityType, ids);
            }
            catch (_a) {
                // Fall through to the per-id lookups below.
                return;
            }
            for (const info of infos) {
                const name = nameOf(info === null || info === void 0 ? void 0 : info.Name);
                if ((info === null || info === void 0 ? void 0 : info.Id) && name !== undefined && name !== null) {
                    this._nameCache[info.Id] = of(name);
                }
            }
        });
    }
    /** Legacy path: one projected `GET` per id. */
    _cacheSingle(entityType, id) {
        if (this._nameCache[id]) {
            return;
        }
        this._nameCache[id] = from(this.httpService.getPartialEntityById(entityType, id, { Name: 1 })).pipe(map((x) => x.Name.Value), shareReplay(1), catchError(() => of(id)));
    }
}
