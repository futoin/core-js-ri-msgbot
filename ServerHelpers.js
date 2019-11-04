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

const _driverImpl = new Map();

/**
 * FTN22: Server-specific helpers
 */
class ServerHelpers {
    /**
     * Get bold text
     * @param {string} str - input
     * @returns {string} bold output
     */
    bold( str ) {
        return str;
    }

    /**
     * Get italic text
     * @param {string} str - input
     * @returns {string} italic output
     */
    italic( str ) {
        return str;
    }

    /**
     * Get colored text
     * @param {string} str - input
     * @param {string} hexcolor - color code
     * @returns {string} colored output
     */
    color( str, hexcolor ) {
        void hexcolor;
        return str;
    }

    /**
     * Get image URL embedded into text
     * @param {string} url - input
     * @returns {string} URL output
     */
    imgUrl( url ) {
        return url;
    }

    /**
     * Get emoji embedded into text
     * @param {string} name - input
     * @returns {string} emoji output
     */
    emoji( name ) {
        return `(${name})`;
    }

    /**
     * Get new line
     * @returns {string} new line
     */
    line() {
        return '\n';
    }

    /**
     * Get actor mention into text
     * @param {string} ext_id - input actor ID
     * @returns {string} mention output
     */
    menion( ext_id ) {
        return `@${ext_id}`;
    }

    /**
     * Add native helper driver
     *
     * @param {string} flavour - system flavour
     * @param {ServerHelpers} impl - driver implementation
     */
    static setDriver( flavour, impl ) {
        _driverImpl.set( flavour, impl );
    }

    /**
     * Get native helper driver
     * @param {string} flavour - system flavour
     * @returns {ServerHelpers} driver implementation
     */
    static getDriver( flavour ) {
        const impl = _driverImpl.get( flavour );

        if ( !impl ) throw new Error( "TooEarlyHelpers" );

        return impl;
    }
}

module.exports = ServerHelpers;
