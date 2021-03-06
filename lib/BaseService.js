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

const PingService = require( 'futoin-executor/PingService' );

/**
 * Base Service with common registration logic
 */
class BaseService extends PingService {
    /**
     * Interface name - to be overridden
     * @alias BaseFace.IFACE_IMPL
     * @property {object}
     */

    /**
     * C-tor
     * @param {object} options - passed to superclass c-tor
     */
    constructor( options ) {
        super( options );
    }

    /**
     * Register Service with Executor
     * @param {AsyncSteps} as - steps interface
     * @param {Executor} executor - executor instance
     * @param {object} options - implementation defined options
     * @returns {BaseService} instance
     */
    static register( as, executor, options={} ) {
        const Face = this.IFACE_IMPL;
        const ifacename = Face.IFACE_NAME;
        const ver = Face.LATEST_VERSION;
        const ifacever = `${ifacename}:${ver}`;
        const impl = new this( options );
        const spec_dirs = Face.spec();

        executor.register( as, ifacever, impl, spec_dirs );

        return impl;
    }
}

module.exports = BaseService;
