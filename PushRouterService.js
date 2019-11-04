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

const BaseService = require( './lib/BaseService' );
const PushHandlerFace = require( './PushHandlerFace' );

const {
    SERVER_FACE_PREFIX,
} = require( './lib/main' );

/**
 * Push Router Service base
 */
class PushRouterService extends BaseService {
    static get IFACE_IMPL() {
        return PushHandlerFace;
    }

    pushMessage( asi, req ) {
        const { msg } = req.params();
        const { server } = msg;
        const srv_face_name = `${SERVER_FACE_PREFIX}${server}`;

        let iface;

        try {
            iface = req.ccm().iface( srv_face_name );
        } catch ( _ ) {
            asi.error( 'UnknownServer', server );
        }

        iface.pushMessage( asi, msg );
    }

    /**
     * Register futoin.msgbot.push interface with Executor
     * @alias PushRouterService.register
     * @param {AsyncSteps} asi - steps interface
     * @param {Executor} executor - executor instance
     * @param {object} options - implementation defined options
     * @param {Executor} options.scope=main.globalScope
     * @returns {PushRouterService} instance
     */
}

module.exports = PushRouterService;
