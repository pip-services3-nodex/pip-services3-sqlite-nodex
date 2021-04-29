import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';

import { IdentifiableJsonSqlitePersistence } from '../../src/persistence/IdentifiableJsonSqlitePersistence';
import { Dummy } from '../fixtures/Dummy';
import { IDummyPersistence } from '../fixtures/IDummyPersistence';

export class DummyJsonSqlitePersistence 
    extends IdentifiableJsonSqlitePersistence<Dummy, string> 
    implements IDummyPersistence
{
    public constructor() {
        super('dummies_json');
    }

    protected defineSchema(): void {
        this.clearSchema();
        this.ensureTable();
        this.ensureSchema("CREATE UNIQUE INDEX IF NOT EXISTS \"" + this._tableName + "_json_key\" ON dummies_json (JSON_EXTRACT(data, '$.key'))");
    }

    public getPageByFilter(correlationId: string, filter: FilterParams,
        paging: PagingParams): Promise<DataPage<Dummy>> {
        filter = filter || new FilterParams();
        let key = filter.getAsNullableString('key');

        let filterCondition: string = null;
        if (key != null)
            filterCondition = "JSON_EXTRACT(data, '$.key')='" + key + "'";

        return super.getPageByFilter(correlationId, filterCondition, paging, null, null);
    }

    public getCountByFilter(correlationId: string, filter: FilterParams): Promise<number> {
        filter = filter || new FilterParams();
        let key = filter.getAsNullableString('key');

        let filterCondition: string = null;
        if (key != null)
            filterCondition = "JSON_EXTRACT(data, '$.key')='" + key + "'";

        return super.getCountByFilter(correlationId, filterCondition);
    }
}