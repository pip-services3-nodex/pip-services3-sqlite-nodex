"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultSqliteFactory = void 0;
/** @module build */
const pip_services3_components_nodex_1 = require("pip-services3-components-nodex");
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const SqliteConnection_1 = require("../connect/SqliteConnection");
/**
 * Creates Sqlite components by their descriptors.
 *
 * @see [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/classes/build.factory.html Factory]]
 * @see [[SqliteConnection]]
 */
class DefaultSqliteFactory extends pip_services3_components_nodex_1.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.registerAsType(DefaultSqliteFactory.SqliteConnectionDescriptor, SqliteConnection_1.SqliteConnection);
    }
}
exports.DefaultSqliteFactory = DefaultSqliteFactory;
DefaultSqliteFactory.SqliteConnectionDescriptor = new pip_services3_commons_nodex_1.Descriptor("pip-services", "connection", "sqlite", "*", "1.0");
//# sourceMappingURL=DefaultSqliteFactory.js.map