/** @module persistence */
import { AnyValueMap } from 'pip-services3-commons-nodex';
import { IIdentifiable } from 'pip-services3-commons-nodex';

import { IdentifiableSqlitePersistence } from './IdentifiableSqlitePersistence';

/**
 * Abstract persistence component that stores data in SQLite in JSON or JSONB fields
 * and implements a number of CRUD operations over data items with unique ids.
 * The data items must implement [[https://pip-services3-nodex.github.io/pip-services3-commons-nodex/interfaces/data.iidentifiable.html IIdentifiable]] interface.
 * 
 * The JSON table has only two fields: id and data.
 * 
 * In basic scenarios child classes shall only override [[getPageByFilter]],
 * [[getListByFilter]] or [[deleteByFilter]] operations with specific filter function.
 * All other operations can be used out of the box. 
 * 
 * In complex scenarios child classes can implement additional operations by 
 * accessing <code>this._collection</code> and <code>this._model</code> properties.

 * ### Configuration parameters ###
 * 
 * - collection:                  (optional) SQLite table name
 * - connection(s):    
 *   - discovery_key:             (optional) a key to retrieve the connection from [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/connect.idiscovery.html IDiscovery]]
 *   - database:                  database file path
 *   - uri:                       resource URI with file:// protocol
 * 
 * ### References ###
 * 
 * - <code>\*:logger:\*:\*:1.0</code>           (optional) [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/log.ilogger.html ILogger]] components to pass log messages components to pass log messages
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/connect.idiscovery.html IDiscovery]] services
 * - <code>\*:credential-store:\*:\*:1.0</code> (optional) Credential stores to resolve credentials
 * 
 * ### Example ###
 * 
 *     class MySqlitePersistence extends IdentifiableSqliteJsonPersistence<MyData, string> {
 *    
 *     public constructor() {
 *         super("mydata");
 *     }
 * 
 *     private composeFilter(filter: FilterParams): any {
 *         filter = filter || new FilterParams();
 *         let criteria = [];
 *         let name = filter.getAsNullableString('name');
 *         if (name != null)
 *             criteria.push("JSON_EXTRACT(data,'$.name')='" + name + "'");
 *         return criteria.length > 0 ? criteria.join(" AND ") : null;
 *     }
 * 
 *     public getPageByFilter(correlationId: string, filter: FilterParams,
 *         paging: PagingParams): Promise<DataPage<MyData>> {
 *         return base.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null);
 *     }
 * 
 *     }
 * 
 *     let persistence = new MySqlitePersistence();
 *     persistence.configure(ConfigParams.fromTuples(
 *         "connection.database", "./data/mydb.db"
 *     ));
 * 
 *     await persitence.open("123");
 * 
 *     let item = await persistence.create("123", { id: "1", name: "ABC" });
 *     let page = await persistence.getPageByFilter(
 *       "123",
 *       FilterParams.fromTuples("name", "ABC"),
 *       null
 *     );
 *     console.log(page.data);          // Result: { id: "1", name: "ABC" }
 * 
 *     await persistence.deleteById("123", "1");
 */
export class IdentifiableJsonSqlitePersistence<T extends IIdentifiable<K>, K> extends IdentifiableSqlitePersistence<T, K> {
    /**
     * Creates a new instance of the persistence component.
     * 
     * @param collection    (optional) a collection name.
     */
    public constructor(tableName: string) {
        super(tableName);
    }

    /**
     * Adds DML statement to automatically create JSON(B) table
     * 
     * @param idType type of the id column (default: VARCHAR(32))
     * @param dataType type of the data column (default: JSON)
     */
    protected ensureTable(idType: string = 'VARCHAR(32)', dataType: string = 'JSON') {
        let query = "CREATE TABLE IF NOT EXISTS " + this.quoteIdentifier(this._tableName)
            + " (id " + idType + " PRIMARY KEY, data " + dataType + ")";
        this.ensureSchema(query);
    }

    /** 
     * Converts object value from internal to public format.
     * 
     * @param value     an object in internal format to convert.
     * @returns converted object in public format.
     */
    protected convertToPublic(value: any): any {
        if (value == null) return null;
         return JSON.parse(value.data);
    }    

    /** 
     * Convert object value from public to internal format.
     * 
     * @param value     an object in public format to convert.
     * @returns converted object in internal format.
     */
    protected convertFromPublic(value: any): any {
        if (value == null) return null;
        let result: any = {
            id: value.id,
            data: JSON.stringify(value)
        };
        return result;
    }    

    /**
     * Updates only few selected fields in a data item.
     * 
     * @param correlation_id    (optional) transaction id to trace execution through call chain.
     * @param id                an id of data item to be updated.
     * @param data              a map with fields to be updated.
     * @returns                 the updated item.
     */
    public async updatePartially(correlationId: string, id: K, data: AnyValueMap): Promise<T> {            
        if (data == null || id == null) {
            return null;
        }

        // let row = this.convertFromPublicPartial(data.getAsObject());
        let values = [JSON.stringify(data.getAsObject()), id];

        let query = "UPDATE " + this.quoteIdentifier(this._tableName)
            + " SET data=JSON_PATCH(data,?) WHERE id=?";

        return await new Promise((resolve, reject) => {
            this._client.serialize(() => {
                this._client.run(query, values, (err, result) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }

                    this._logger.trace(correlationId, "Updated partially in %s with id = %s", this._tableName, id);

                    let query = "SELECT * FROM " + this.quoteIdentifier(this._tableName) + " WHERE id=?";
                    this._client.get(query, [id], (err, result) => {
                        if (err != null) {
                            reject(err);
                            return;
                        }
            
                        let newItem = result ? this.convertToPublic(result) : null;
                        resolve(newItem);
                    });
                });    
            });
        });
    }

}
