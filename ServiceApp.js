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

const AdvancedCCM = require( 'futoin-invoker/AdvancedCCM' );
const Executor = require( 'futoin-executor/Executor' );

const ConsoleFace = require( '@futoin/log/ConsoleFace' );

const {
    ROUTER_FACE,
    PUSH_FACE,
} = require( './lib/main' );

const CommandRouterFace = require( './CommandRouterFace' );
const CommandRouterService = require( './CommandRouterService' );
const PushHandlerFace = require( './PushHandlerFace' );
const PushRouterService = require( './PushRouterService' );


/**
 * Basic bot service app.
 *
 * Actual bot implementation is expected to inherit this class and override
 * registration functions.
 */
class ServiceApp {
    /**
     * C-tor
     *
     * @param {AsyncSteps} asi - AsyncSteps interface
     * @param {object} options={} - options
     * @param {AdvancedCCM} [options.ccm] - external CCM instance
     * @param {Executor} [options.executor] - external executor instance
     * @param {object} [options.ccmOptions] - auto-CCM options
     * @param {callable} [options.notExpectedHandler] - 'notExpected' error handler
     * @param {object} [options.executorOptions] - private auto-Executor options
     */
    constructor( asi, options = {} ) {
        let {
            ccm,
            executor,
            notExpectedHandler,
        } = options;

        // Init of standard FutoIn components
        if ( !ccm ) {
            ccm = new AdvancedCCM( options.ccmOptions );
        }

        ccm.once( 'close', () => {
            this._ccm = null;
            this.close();
        } );

        if ( !executor ) {
            executor = new Executor( ccm, options.executorOptions );
        }

        if ( !notExpectedHandler ) {
            notExpectedHandler = function() {
                // eslint-disable-next-line no-console
                console.log( arguments );
            };
        }

        executor.on( 'notExpected', notExpectedHandler );

        this._ccm = ccm;
        this._executor = executor;
        this._notExpectedHandler = notExpectedHandler;

        asi.add( ( asi ) => {
            CommandRouterService.register( asi, executor, options );
            CommandRouterFace.register( asi, ccm, ROUTER_FACE, executor, null, options );

            PushRouterService.register( asi, executor, options );
            PushHandlerFace.register( asi, ccm, PUSH_FACE, executor, null, options );
        } );

        asi.add( ( asi ) => this._register_logsvc( asi, options ) );
        asi.add( ( asi ) => this._register_handlers( asi, options ) );
        asi.add( ( asi ) => this._register_servers( asi, options ) );
    }

    /**
     * CCM instance accessor
     * @returns {AdvancedCCM} instance
     */
    ccm() {
        return this._ccm;
    }

    /**
     * Executor instance accessor
     * @returns {Executor} instance
     */
    executor() {
        return this._executor;
    }

    /**
     * Shutdown of app and related instances
     * @param {callable} [done] - done callback
     */
    close( done=null ) {
        if ( this._ccm ) {
            this._ccm.close();
            this._ccm = null;

            this._executor.close( done );
        }

        this._executor = null;
    }

    /**
     * Create an instance of executor which is useful to register
     * services.
     * @returns {Executor} instance
     */
    newExecutor() {
        const executor = new Executor( this.ccm() );
        executor.on( 'notExpected', this._notExpectedHandler );
        return executor;
    }

    /**
     * Override to register custom log service
     * @virtual
     * @param {AsyncSteps} asi - AsyncSteps interface
     * @param {object} options={} - options
     */
    _register_logsvc( asi, options ) {
        try {
            this.ccm().log();
        } catch ( _ ) {
            ConsoleFace.register( asi, this.ccm(), options );
        }
    }

    /**
     * Override to register custom business logic.
     * @virtual
     * @param {AsyncSteps} asi - AsyncSteps interface
     * @param {object} options={} - options
     */
    _register_handlers( asi, options ) {
        void options;
    }

    /**
     * Override to register servers.
     * @virtual
     * @param {AsyncSteps} asi - AsyncSteps interface
     * @param {object} options={} - options
     */
    _register_servers( asi, options ) {
        void options;
    }
}

module.exports = ServiceApp;
