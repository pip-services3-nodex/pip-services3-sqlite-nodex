const process = require('process');
const assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';
import { References } from 'pip-services3-commons-nodex';
import { SqliteConnection } from '../../src/connect/SqliteConnection';
import { DummyPersistenceFixture } from '../fixtures/DummyPersistenceFixture';
import { DummySqlitePersistence } from './DummySqlitePersistence';

suite('DummySqliteConnection', ()=> {
    let connection: SqliteConnection;
    let persistence: DummySqlitePersistence;
    let fixture: DummyPersistenceFixture;

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

        persistence = new DummySqlitePersistence();
        persistence.setReferences(References.fromTuples(
            new Descriptor("pip-services", "connection", "sqlite", "default", "1.0"), connection
        ));

        fixture = new DummyPersistenceFixture(persistence);

        await connection.open(null);
        await persistence.open(null);
        await persistence.clear(null);
    });

    teardown(async () => {
        await connection.close(null);
        await persistence.close(null);
    });

    test('Connection', () => {
        assert.isDefined(connection.getConnection());
        assert.isString(connection.getDatabaseName());
    });

    test('Crud Operations', async () => {
        await fixture.testCrudOperations();
    });

    test('Batch Operations', async () => {
        await fixture.testBatchOperations();
    });
});