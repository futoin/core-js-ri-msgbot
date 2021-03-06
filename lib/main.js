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

const FACE_PREFIX = '#msgbot.';

exports = module.exports = {
    specDirs : require( '@futoin/specs' ).SPEC_DIRS,

    PING_VERSION: '1.0',
    FTN22_VERSION: '0.2',

    FACE_PREFIX,
    ROUTER_FACE : `${FACE_PREFIX}router`,
    PUSH_FACE : `${FACE_PREFIX}push`,
    SERVER_FACE_PREFIX : `${FACE_PREFIX}server.`,
};

Object.freeze( exports );

