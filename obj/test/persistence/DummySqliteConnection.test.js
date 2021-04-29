"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const process = require('process');
const assert = require('chai').assert;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_3 = require("pip-services3-commons-nodex");
const SqliteConnection_1 = require("../../src/connect/SqliteConnection");
const DummyPersistenceFixture_1 = require("../fixtures/DummyPersistenceFixture");
const DummySqlitePersistence_1 = require("./DummySqlitePersistence");
suite('DummySqliteConnection', () => {
    let connection;
    let persistence;
    let fixture;
    let sqliteDatabase = process.env['SQLITE_DB'] || './data/test.db';
    if (sqliteDatabase == null) {
        return;
    }
    setup(() => __awaiter(void 0, void 0, void 0, function* () {
        let dbConfig = pip_services3_commons_nodex_1.ConfigParams.fromTuples('connection.database', sqliteDatabase);
        connection = new SqliteConnection_1.SqliteConnection();
        connection.configure(dbConfig);
        persistence = new DummySqlitePersistence_1.DummySqlitePersistence();
        persistence.setReferences(pip_services3_commons_nodex_3.References.fromTuples(new pip_services3_commons_nodex_2.Descriptor("pip-services", "connection", "sqlite", "default", "1.0"), connection));
        fixture = new DummyPersistenceFixture_1.DummyPersistenceFixture(persistence);
        yield connection.open(null);
        yield persistence.open(null);
        yield persistence.clear(null);
    }));
    teardown(() => __awaiter(void 0, void 0, void 0, function* () {
        yield connection.close(null);
        yield persistence.close(null);
    }));
    test('Connection', () => {
        assert.isDefined(connection.getConnection());
        assert.isString(connection.getDatabaseName());
    });
    test('Crud Operations', () => __awaiter(void 0, void 0, void 0, function* () {
        yield fixture.testCrudOperations();
    }));
    test('Batch Operations', () => __awaiter(void 0, void 0, void 0, function* () {
        yield fixture.testBatchOperations();
    }));
});
//# sourceMappingURL=DummySqliteConnection.test.js.map