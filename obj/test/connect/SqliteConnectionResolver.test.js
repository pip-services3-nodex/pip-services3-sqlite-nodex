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
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const SqliteConnectionResolver_1 = require("../../src/connect/SqliteConnectionResolver");
suite('SqliteConnectionResolver', () => {
    test('Connection Config with Params', () => __awaiter(void 0, void 0, void 0, function* () {
        let dbConfig = pip_services3_commons_nodex_1.ConfigParams.fromTuples('connection.database', './data/test.db');
        let resolver = new SqliteConnectionResolver_1.SqliteConnectionResolver();
        resolver.configure(dbConfig);
        let config = yield resolver.resolve(null);
        assert.isObject(config);
        assert.equal('./data/test.db', config.database);
    }));
    test('Connection Config with URI', () => __awaiter(void 0, void 0, void 0, function* () {
        let dbConfig = pip_services3_commons_nodex_1.ConfigParams.fromTuples('connection.uri', 'file://./data/test.db');
        let resolver = new SqliteConnectionResolver_1.SqliteConnectionResolver();
        resolver.configure(dbConfig);
        let config = yield resolver.resolve(null);
        assert.isObject(config);
        assert.equal('./data/test.db', config.database);
    }));
});
//# sourceMappingURL=SqliteConnectionResolver.test.js.map