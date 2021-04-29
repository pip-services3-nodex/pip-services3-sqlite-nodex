const assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-nodex';
import { SqliteConnectionResolver } from '../../src/connect/SqliteConnectionResolver';

suite('SqliteConnectionResolver', ()=> {

    test('Connection Config with Params', async () => {
        let dbConfig = ConfigParams.fromTuples(
            'connection.database', './data/test.db'
        );

        let resolver = new SqliteConnectionResolver();
        resolver.configure(dbConfig);

        let config = await resolver.resolve(null);
        assert.isObject(config);
        assert.equal('./data/test.db', config.database);
    });

    test('Connection Config with URI', async () => {
        let dbConfig = ConfigParams.fromTuples(
            'connection.uri', 'file://./data/test.db'
        );

        let resolver = new SqliteConnectionResolver();
        resolver.configure(dbConfig);

        let config = await resolver.resolve(null);
        assert.isObject(config);
        assert.equal('./data/test.db', config.database);
    });
});