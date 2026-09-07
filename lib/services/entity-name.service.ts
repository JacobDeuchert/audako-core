import { catchError, combineLatest, firstValueFrom, from, map, Observable, of, shareReplay } from 'rxjs';
import { EntityType, Field } from '../models/entities/configuration-entity.model.js';
import { EntityHttpService, EntityInfo } from './entity-http.service.js';

/**
 * Reads the plain name out of a name field, which may be a `Field`, a string, or missing.
 * Returns `null` when there is no usable name.
 */
function nameOf(value: EntityInfo['Name'] | null | undefined): string | null {
  if (Field.isField(value)) {
    const inner = (value as Field<string>).Value;
    return inner === undefined || inner === null ? null : String(inner);
  }
  return typeof value === 'string' ? value : null;
}

export class EntityNameService {
  private _nameCache: { [p: string]: Observable<string> };

  constructor(private httpService: EntityHttpService) {
    this._nameCache = {};
  }

  /**
   * Human readable group path of an entity (`Parent / Child`). With `limit` only the last
   * `limit` path segments are used; with `includeSelf` the entity's own name is appended.
   */
  public async resolveEntityPath(
    entityType: EntityType,
    id: string,
    includeSelf: boolean = false,
    limit?: number,
    separator: string = ' / ',
  ): Promise<string> {
    const entity = await this.httpService.getPartialEntityById(entityType, id, { Name: 1, Path: 1 });
    const fullPath = Array.isArray(entity.Path) ? entity.Path : [];
    const idPath = limit ? fullPath.slice(Math.max(fullPath.length - limit, 0)) : fullPath;

    let path = await this.resolvePathName(idPath, separator);

    if (includeSelf) {
      const ownName = nameOf(entity.Name) ?? id;
      path = path ? path + separator + ownName : ownName;
    }

    return path;
  }

  public async resolvePathName(idPath: string[], separator: string = ' / '): Promise<string> {
    if (idPath.length === 0) {
      return '';
    }
    const names = await this.resolveNames(EntityType.Group, idPath);
    return names.join(separator);
  }

  public async resolveName(entityType: EntityType, id: string): Promise<string> {
    const names = await this.resolveNames(entityType, [id]);
    return names[0];
  }

  /**
   * Names of several entities of one type, in the order of `ids`. Unresolvable ids resolve to the
   * id itself. Names are cached per id for the lifetime of the service.
   *
   * On v5 the uncached ids are fetched with a single `entity-info` request
   * (`supports('entityInfo')`); on v4 one projected `GET` per id is issued, as before.
   */
  public async resolveNames(entityType: EntityType, ids: string[]): Promise<string[]> {
    const missing = ids.filter((id) => !this._nameCache[id]);
    if (missing.length > 0) {
      const versionInfo = await this.httpService.ctx.getVersionInfo();
      if (versionInfo.supports('entityInfo')) {
        await this._cacheFromEntityInfo(entityType, missing);
      }
      for (const id of missing) {
        this._cacheSingle(entityType, id);
      }
    }

    return firstValueFrom(combineLatest(ids.map((id) => this._nameCache[id])));
  }

  /** Fills the cache from one `entity-info` request. Ids the platform did not return stay uncached. */
  private async _cacheFromEntityInfo(entityType: EntityType, ids: string[]): Promise<void> {
    let infos: EntityInfo[] = [];
    try {
      infos = await this.httpService.getEntityInfosByIds(entityType, ids);
    } catch {
      // Fall through to the per-id lookups below.
      return;
    }

    for (const info of infos) {
      const name = nameOf(info?.Name);
      if (info?.Id && name !== null) {
        this._nameCache[info.Id] = of(name);
      }
    }
  }

  /** Legacy path: one projected `GET` per id. A missing name falls back to the id. */
  private _cacheSingle(entityType: EntityType, id: string): void {
    if (this._nameCache[id]) {
      return;
    }

    this._nameCache[id] = from(this.httpService.getPartialEntityById(entityType, id, { Name: 1 })).pipe(
      map((entity) => nameOf(entity?.Name) ?? id),
      shareReplay(1),
      catchError(() => of(id)),
    );
  }
}
