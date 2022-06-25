import { catchError, combineLatest, firstValueFrom, from, map, Observable, of, shareReplay } from 'rxjs';
import { EntityType } from '../models/entities/configuration-entity.model';
import { EntityHttpService } from './entity-http.service';

export class EntityNameService {
  private _nameCache: { [p: string]: Observable<string> };

  constructor(private httpService: EntityHttpService) {
    this._nameCache = {};
  }

  public async resolveEntityPath(
    entityType: EntityType,
    id: string,
    includeSelf: boolean = false,
    limit?: number
  ): Promise<string> {
    const entity = await this.httpService.getPartialEntityById(entityType, id, { Name: 1, Path: 1 });
    let path = await this.resolvePathName(
      entity.Path.splice(limit ? entity.Path.length - limit : 0, entity.Path.length)
    );

    if (includeSelf) {
      path = path + '/' + entity.Name.Value;
    }

    return path;
  }

  public async resolvePathName(idPath: string[]): Promise<string> {
    if (idPath.length === 0) {
      return '';
    }
    return firstValueFrom(
      combineLatest(idPath.map((id) => this.resolveName(EntityType.Group, id))).pipe(map((names) => names.join(' / ')))
    );
  }

  public async resolveName(entityType: EntityType, id: string): Promise<string> {
    if (!this._nameCache[id]) {
      this._nameCache[id] = from(this.httpService.getPartialEntityById(entityType, id, { Name: 1 })).pipe(
        map((x) => x.Name.Value),
        shareReplay(1),
        catchError(() => of(id))
      );
    }

    return firstValueFrom(this._nameCache[id]);
  }
}
