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
exports.SqliteConnectionResolver = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_components_nodex_1 = require("pip-services3-components-nodex");
const pip_services3_components_nodex_2 = require("pip-services3-components-nodex");
/**
 * Helper class that resolves SQLite connection and credential parameters,
 * validates them and generates a connection URI.
 *
 * It is able to process multiple connections to SQLite cluster nodes.
 *
 *  ### Configuration parameters ###
 *
 * - connection(s):
 *   - discovery_key:             (optional) a key to retrieve the connection from [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/connect.idiscovery.html IDiscovery]]
 *   - database:                  database file path
 *   - uri:                       resource URI with file:// protocol
 *
 * ### References ###
 *
 * - <code>\*:discovery:\*:\*:1.0</code>             (optional) [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/connect.idiscovery.html IDiscovery]] services
 * - <code>\*:credential-store:\*:\*:1.0</code>      (optional) Credential stores to resolve credentials
 */
class SqliteConnectionResolver {
    constructor() {
        /**
         * The connections resolver.
         */
        this._connectionResolver = new pip_services3_components_nodex_1.ConnectionResolver();
        /**
         * The credentials resolver.
         */
        this._credentialResolver = new pip_services3_components_nodex_2.CredentialResolver();
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        this._connectionResolver.configure(config);
        this._credentialResolver.configure(config);
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        this._connectionResolver.setReferences(references);
        this._credentialResolver.setReferences(references);
    }
    validateConnection(correlationId, connection) {
        let uri = connection.getUri();
        if (uri != null) {
            if (!uri.startsWith("file://")) {
                throw new pip_services3_commons_nodex_1.ConfigException(correlationId, "WRONG_PROTOCOL", "Connection protocol must be file://");
            }
            return;
        }
        // let host = connection.getHost();
        // if (host == null) {
        //     throw new ConfigException(
        //         correlationId,
        //         "NO_HOST",
        //         "Connection host is not set"
        //     );
        // }
        // let port = connection.getPort();
        // if (port == 0) {
        //     throw new ConfigException(
        //         correlationId,
        //         "NO_PORT",
        //         "Connection port is not set"
        //     );
        // }
        let database = connection.getAsNullableString("database");
        if (database == null) {
            throw new pip_services3_commons_nodex_1.ConfigException(correlationId, "NO_DATABASE", "Connection database is not set");
        }
        return null;
    }
    validateConnections(correlationId, connections) {
        if (connections == null || connections.length == 0) {
            throw new pip_services3_commons_nodex_1.ConfigException(correlationId, "NO_CONNECTION", "Database connection is not set");
        }
        for (let connection of connections) {
            this.validateConnection(correlationId, connection);
        }
    }
    composeConfig(connections, credential) {
        let config = {};
        // Define connection part
        for (let connection of connections) {
            let uri = connection.getUri();
            if (uri) {
                // Removing file://
                config.database = uri.substring(7);
            }
            // let host = connection.getHost();
            // if (host) config.host = host;
            // let port = connection.getPort();
            // if (port) config.port = port;
            let database = connection.getAsNullableString("database");
            if (database)
                config.database = database;
        }
        // Define authentication part
        // if (credential) {
        //     let username = credential.getUsername();
        //     if (username) config.user = username;
        //     let password = credential.getPassword();
        //     if (password) config.password = password;
        // }
        return config;
    }
    /**
     * Resolves SQLite connection URI from connection and credential parameters.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @returns 			    a resolved config.
     */
    resolve(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            let connections = yield this._connectionResolver.resolveAll(correlationId);
            // Validate connections
            this.validateConnections(correlationId, connections);
            let credential = yield this._credentialResolver.lookup(correlationId);
            // Credentials are not validated right now
            let config = this.composeConfig(connections, credential);
            return config;
        });
    }
}
exports.SqliteConnectionResolver = SqliteConnectionResolver;
//# sourceMappingURL=SqliteConnectionResolver.js.map