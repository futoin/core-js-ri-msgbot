'use strict';

/**
 * @file
 *
 * Copyright 2019 FutoIn Project (https://futoin.org)
 * Copyright 2019 Andrey Galkin <andrey@futoin.org>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const PushHandlerFace = require( './PushHandlerFace' );
const ServerHelpers = require( './ServerHelpers' );

/**
 * FTN22: Server Face
 */
class ServerFace extends PushHandlerFace {
    static get IFACE_NAME() {
        return 'futoin.msgbot.server';
    }

    constructor( ...args ) {
        super( ...args );
        this._server_type = null;
    }

    /**
     * Get type of database
     *
     * @param {AsyncSteps} asi - steps interface
     */
    getFlavour( asi ) {
        const server_type = this._server_type;

        if ( !server_type ) {
            this.call( asi, 'getFlavour' );
            asi.add( ( asi, res ) => {
                this._server_type = res;
                asi.success( res );
            } );
        } else {
            asi.success( server_type );
        }
    }

    /**
     * Get native server helpers
     * @returns {ServerHelpers} - driver implementation
     */
    helpers() {
        return ServerHelpers.getDriver( this._server_type );
    }

    /**
     * Get native message system interface implementation
     */
    systemIface() {
        throw new Error( 'NotImplemented' );
    }

    /**
     * CCM registration helper
     *
     * @function ServerFace.register
     * @param {AsyncSteps} asi - steps interface
     * @param {AdvancedCCM} ccm - CCM instance
     * @param {string} name - CCM registration name
     * @param {*} endpoint - see AdvancedCCM#register
     * @param {*} [credentials=null] - see AdvancedCCM#register
     * @param {object} [options={}] - interface options
     * @param {string} [options.version=<latest>] - interface version to use
     */
    static register( asi, ccm, name, ...args ) {
        super.register( asi, ccm, name, ...args );
        asi.add( asi => ccm.iface( name ).getFlavour( asi ) );
    }
}

module.exports = ServerFace;
