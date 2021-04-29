const assert = require('chai').assert;
const process = require('process');

import { ConfigParams } from 'pip-services3-commons-nodex';
import { SqliteConnection } from '../../src/connect/SqliteConnection';

suite('SqliteConnection', ()=> {
    let connection: SqliteConnection;

    let sqliteDatabase = process.env['SQLITE_DB'] || './data/test.db';

    if (sqliteDatabase == null) {
        return;
    }

    setup(async () => {
        let dbConfig = ConfigParams.fromTuples(
            'connection.database', sqliteDatabase
        );

        connection = new SqliteConnection();
        connection.configure(dbConfig);

        await connection.open(null);
    });

    teardown(async () => {
        await connection.close(null);
    });

    test('Open and Close', () => {
        assert.isDefined(connection.getConnection());
        assert.isString(connection.getDatabaseName());
    });
});