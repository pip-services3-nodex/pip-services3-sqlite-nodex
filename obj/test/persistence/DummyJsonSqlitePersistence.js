"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyJsonSqlitePersistence = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const IdentifiableJsonSqlitePersistence_1 = require("../../src/persistence/IdentifiableJsonSqlitePersistence");
class DummyJsonSqlitePersistence extends IdentifiableJsonSqlitePersistence_1.IdentifiableJsonSqlitePersistence {
    constructor() {
        super('dummies_json');
    }
    defineSchema() {
        this.clearSchema();
        this.ensureTable();
        this.ensureSchema("CREATE UNIQUE INDEX IF NOT EXISTS \"" + this._tableName + "_json_key\" ON dummies_json (JSON_EXTRACT(data, '$.key'))");
    }
    getPageByFilter(correlationId, filter, paging) {
        filter = filter || new pip_services3_commons_nodex_1.FilterParams();
        let key = filter.getAsNullableString('key');
        let filterCondition = null;
        if (key != null)
            filterCondition = "JSON_EXTRACT(data, '$.key')='" + key + "'";
        return super.getPageByFilter(correlationId, filterCondition, paging, null, null);
    }
    getCountByFilter(correlationId, filter) {
        filter = filter || new pip_services3_commons_nodex_1.FilterParams();
        let key = filter.getAsNullableString('key');
        let filterCondition = null;
        if (key != null)
            filterCondition = "JSON_EXTRACT(data, '$.key')='" + key + "'";
        return super.getCountByFilter(correlationId, filterCondition);
    }
}
exports.DummyJsonSqlitePersistence = DummyJsonSqlitePersistence;
//# sourceMappingURL=DummyJsonSqlitePersistence.js.map