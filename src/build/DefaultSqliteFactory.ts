/** @module build */
import { Factory } from 'pip-services3-components-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';

import { SqliteConnection } from '../connect/SqliteConnection';

/**
 * Creates Sqlite components by their descriptors.
 * 
 * @see [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/classes/build.factory.html Factory]]
 * @see [[SqliteConnection]]
 */
export class DefaultSqliteFactory extends Factory {
    private static readonly SqliteConnectionDescriptor: Descriptor = new Descriptor("pip-services", "connection", "sqlite", "*", "1.0");

    /**
	 * Create a new instance of the factory.
	 */
    public constructor() {
        super();
        this.registerAsType(DefaultSqliteFactory.SqliteConnectionDescriptor, SqliteConnection);
    }
}
