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

const ReactHandlerService = require( './ReactHandlerService' );
const CommandRouterFace = require( './CommandRouterFace' );

const _includes = require( 'lodash/includes' );
const _pull = require( 'lodash/pull' );

/**
 * Command Router Service
 */
class CommandRouterService extends ReactHandlerService {
    static get IFACE_IMPL() {
        return CommandRouterFace;
    }

    /**
     * C-tor
     * @param {object} options - passed to superclass c-tor
     */
    constructor( options ) {
        super( options );

        this._commands = new Map();
        this._events = new Map();
        this._catch_all = [];
    }

    registerHandler( asi, req ) {
        const { ccm_name, commands, events, catch_all } = req.params();

        try {
            req.ccm().iface( ccm_name );
        } catch( _ ) {
            req.ccm().log().error( `CommandRouter: not found ${ccm_name}` );
            asi.error( 'UnknownInterface', ccm_name );
        }

        const add_helper = ( arr ) => {
            if ( _includes( arr, ccm_name ) ) {
                asi.error( 'AlreadyRegistered', ccm_name );
            }

            arr.push( ccm_name );
        };

        const add_map_helper = ( map, keys ) => {
            for ( let k of keys ) {
                const a = map.get( k ) || [];
                add_helper( a );
                map.set( k, a );
            }
        };

        add_map_helper( this._commands, commands );
        add_map_helper( this._events, events );

        if ( catch_all ) {
            add_helper( this._catch_all );
        }

        req.ccm().log().debug( `CommandRouter: router register ${ccm_name}` );
        req.result( true );
    }

    unRegisterHandler( asi, req ) {
        const { ccm_name } = req.params();
        let removed = false;

        const remove_helper = ( arr ) => {
            const alen = arr.length;
            _pull( arr, ccm_name );
            removed = removed || alen !== arr.length;
        };

        for ( let m of [ this._commands, this._events ] ) {
            for ( let [ k, v ] of m ) {
                remove_helper( v );

                if ( v.length === 0 ) {
                    m.delete( k );
                }
            }
        }

        remove_helper( this._catch_all );

        if ( !removed ) {
            req.ccm().log().error( `CommandRouter: not registered ${ccm_name}` );
            asi.error( 'NotRegistered', ccm_name );
        }

        req.ccm().log().debug( `CommandRouter: unregister ${ccm_name}` );
        req.result( true );
    }

    onMessage( asi, req ) {
        const { msg } = req.params();
        const { payload } = msg;
        const ccm = req.ccm();

        ccm.log().debug(
            `CommandRouter:M ${msg.server}:${msg.channel || ''}:${msg.sender} ${payload}`
        );

        for ( let cn of this._catch_all ) {
            // NOTE: makes sense to optimize
            ccm.iface( cn ).onMessage( asi, msg );
        }

        let rsp = '';

        for ( let [ k, v ] of this._commands ) {
            if ( payload.startsWith( k ) ) {
                const m = Object.assign( {}, msg );
                m.payload = payload.substring( k.length );

                for ( let cn of v ) {
                    // NOTE: makes sense to optimize
                    ccm.iface( cn ).onMessage( asi, m );
                    asi.add( ( asi, res ) => {
                        rsp = res.rsp || rsp;
                    } );
                }
            }
        }

        asi.add( asi => {
            req.result( { rsp } );
        } );
    }

    onEvent( asi, req ) {
        const { evt } = req.params();
        const { name } = evt;
        const ccm = req.ccm();

        ccm.log().debug(
            `CommandRouter:E ${evt.server}:${evt.channel || ''}:${evt.name} ` +
            JSON.stringify( evt.data )
        );

        for ( let cn of this._catch_all ) {
            // NOTE: makes sense to optimize
            ccm.iface( cn ).onEvent( asi, evt );
        }

        const event_handlers = this._events.get( name ) || [];

        for ( let cn of event_handlers ) {
            // NOTE: makes sense to optimize
            ccm.iface( cn ).onEvent( asi, evt );
        }

        req.result( true );
    }

    /**
     * Register futoin.msgbot.router interface with Executor
     * @alias CommandRouterService.register
     * @param {AsyncSteps} asi - steps interface
     * @param {Executor} executor - executor instance
     * @param {object} options - implementation defined options
     * @param {Executor} options.scope=main.globalScope
     * @returns {CommandRouterService} instance
     */
}

module.exports = CommandRouterService;
