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
const assert = require('chai').assert;
const process = require('process');
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const SqliteConnection_1 = require("../../src/connect/SqliteConnection");
suite('SqliteConnection', () => {
    let connection;
    let sqliteDatabase = process.env['SQLITE_DB'] || './data/test.db';
    if (sqliteDatabase == null) {
        return;
    }
    setup(() => __awaiter(void 0, void 0, void 0, function* () {
        let dbConfig = pip_services3_commons_nodex_1.ConfigParams.fromTuples('connection.database', sqliteDatabase);
        connection = new SqliteConnection_1.SqliteConnection();
        connection.configure(dbConfig);
        yield connection.open(null);
    }));
    teardown(() => __awaiter(void 0, void 0, void 0, function* () {
        yield connection.close(null);
    }));
    test('Open and Close', () => {
        assert.isDefined(connection.getConnection());
        assert.isString(connection.getDatabaseName());
    });
});
//# sourceMappingURL=SqliteConnection.test.js.map