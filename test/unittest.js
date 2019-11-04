'use strict';

const expect = require( 'chai' ).expect;

const $as_test = require( 'futoin-asyncsteps/testcase' );
const AdvancedCCM = require( 'futoin-invoker/AdvancedCCM' );
const Executor = require( 'futoin-executor/Executor' );
const SpecTools = require( 'futoin-invoker/SpecTools' );

const PushHandlerFace = require( '../PushHandlerFace' );
const PushHandlerService = require( '../PushHandlerService' );
const PushRouterService = require( '../PushHandlerService' );
const ReactHandlerFace = require( '../ReactHandlerFace' );
const ReactHandlerService = require( '../ReactHandlerService' );
const CommandRouterFace = require( '../CommandRouterFace' );
const CommandRouterService = require( '../CommandRouterService' );
const ServerFace = require( '../ServerFace' );
const ServerService = require( '../ServerService' );
const ServerHelpers = require( '../ServerHelpers' );
const ServiceApp = require( '../ServiceApp' );

SpecTools.on( 'error', ( ...args ) => console.log( args ) );

const {
    ROUTER_FACE,
    PUSH_FACE,
    SERVER_FACE_PREFIX,
} = require( '../lib/main' );

class MockServer extends ServerService {
    constructor( options ) {
        super( options );
        this.last_msg = null;
        this.count = 0;
    }

    pushMessage( asi, req ) {
        this.last_msg = req.params().msg;
        this.count++;
        req.result( true );
    }

    getFlavour( asi, req ) {
        req.result( 'mock' );
    }
}

class MockHandler extends CommandRouterService {
    constructor( options ) {
        super( options );
        this.last_msg = null;
        this.last_evt = null;
        this.count = 0;
    }

    onMessage( asi, req ) {
        this.last_msg = req.params().msg;
        this.count++;
        req.result( { rsp: 'mock' } );
    }

    onEvent( asi, req ) {
        this.last_evt = req.params().evt;
        this.count++;
        req.result( true );
    }
}



describe( 'Registration Test', function() {
    const pairs = {
        PushHandler: [ PushHandlerFace, PushHandlerService ],
        PushRouter: [ PushHandlerFace, PushRouterService ],
        ReactHandler: [ ReactHandlerFace, ReactHandlerService ],
        CommandRouter: [ CommandRouterFace, CommandRouterService ],
        Server: [ ServerFace, MockServer ],
    };

    for ( let k in pairs ) {
        const p = pairs[k];
        const face = p[0];
        const svc = p[1];

        it( `Should register ${k}`, $as_test( asi => {
            const ccm = new AdvancedCCM();
            const executor = new Executor( ccm );

            p[1].register( asi, executor );
            p[0].register( asi, ccm, k, executor );

            asi.add( asi => {
                ccm.iface( k ).ping( asi, 1234 );
            } );
            asi.add( asi => {
                ccm.close();
            } );
        } ) );
    }

    it( `Create ServiceApp`, $as_test( asi => {
        const app = new ServiceApp( asi );
    } ) );
} );

describe( 'PushRouterService', function() {
    it( 'should route push message', $as_test( asi => {
        const app = new ServiceApp( asi );
        const ccm = app.ccm();
        const exec1 = app.newExecutor();
        const exec2 = app.newExecutor();
        const svc1 = MockServer.register( asi, exec1 );
        const svc2 = MockServer.register( asi, exec2 );
        ServerFace.register( asi, ccm, `${SERVER_FACE_PREFIX}01234567890123456789ab`, exec1 );
        ServerFace.register( asi, ccm, `${SERVER_FACE_PREFIX}01234567890123456789cb`, exec2 );

        asi.add( ( asi ) => {
            app.ccm().iface( PUSH_FACE ).pushMessage( asi, {
                server: '01234567890123456789ab',
                payload: 'txt1',
            } );

            for ( let i = 0; i < 2; ++i ) {
                app.ccm().iface( PUSH_FACE ).pushMessage( asi, {
                    server: '01234567890123456789cb',
                    payload: 'txt2',
                } );
            }
        } );
        asi.add( ( asi ) => {
            expect( svc1.count ).equal( 1 );
            expect( svc1.last_msg.payload ).equal( 'txt1' );
            expect( svc2.count ).equal( 2 );
            expect( svc2.last_msg.payload ).equal( 'txt2' );
        } );
    } ) );

    it( 'should fail on invalid server', $as_test(
        asi => {
            const app = new ServiceApp( asi );
            asi.add( asi => {
                app.ccm().iface( PUSH_FACE ).pushMessage( asi, {
                    server: '01234567890123456789ab',
                    payload: 'txt',
                } );
            } );
        },
        ( asi, err ) => {
            if ( err == 'UnknownServer' ) {
                asi.success();
            }
        }
    ) );
} );

describe( 'CommandRouterService', function() {
    const common_test = ( asi, app ) => {
        asi.add( asi => {
            const iface = app.ccm().iface( ROUTER_FACE );
            iface.onEvent( asi, {
                server: '01234567890123456789ab',
                name: 'SOME_EVT',
                data: 'txt',
                ts: '2019-01-01T12:00:00Z',
            } );
            iface.onMessage( asi, {
                server: '01234567890123456789ab',
                payload: 'txt',
                private: false,
                sender: 'a1234',
                ts: '2019-01-01T12:00:00.123456Z',
            } );
        } );
    };

    it( 'should work with no registrations', $as_test( asi => {
        const app = new ServiceApp( asi );
        common_test( asi, app );
    } ) );

    it( 'should correctly register', $as_test( asi => {
        const app = new ServiceApp( asi );
        const ccm = app.ccm();
        const exec1 = app.newExecutor();
        CommandRouterService.register( asi, exec1 );
        ReactHandlerFace.register( asi, ccm, 'test_handler', exec1 );

        asi.add( ( asi ) => {
            ccm.iface( ROUTER_FACE ).registerHandler(
                asi,
                'test_handler',
                [ 'abc' ],
                [ 'EVT' ],
                false
            );
            common_test( asi, app );
        } );
    } ) );

    it( 'should detected repeated registration on command', $as_test(
        asi => {
            const app = new ServiceApp( asi );
            const ccm = app.ccm();
            const exec1 = app.newExecutor();
            CommandRouterService.register( asi, exec1 );
            ReactHandlerFace.register( asi, ccm, 'test_handler', exec1 );

            asi.add( ( asi ) => {
                for ( let i = 0; i < 2; ++i ) {
                    ccm.iface( ROUTER_FACE ).registerHandler(
                        asi,
                        'test_handler',
                        [ 'abc' ],
                        [],
                        false
                    );
                }

                common_test( asi, app );
            } );
        },
        ( asi, err ) => {
            if ( err === 'AlreadyRegistered' ) {
                asi.success();
            }
        }
    ) );

    it( 'should detected repeated registration on event', $as_test(
        asi => {
            const app = new ServiceApp( asi );
            const ccm = app.ccm();
            const exec1 = app.newExecutor();
            CommandRouterService.register( asi, exec1 );
            ReactHandlerFace.register( asi, ccm, 'test_handler', exec1 );

            asi.add( ( asi ) => {
                for ( let i = 0; i < 2; ++i ) {
                    ccm.iface( ROUTER_FACE ).registerHandler(
                        asi,
                        'test_handler',
                        [],
                        [ 'EVT' ],
                        false
                    );
                }

                common_test( asi, app );
            } );
        },
        ( asi, err ) => {
            if ( err === 'AlreadyRegistered' ) {
                asi.success();
            }
        }
    ) );

    it( 'should detected repeated registration on catch all', $as_test(
        asi => {
            const app = new ServiceApp( asi );
            const ccm = app.ccm();
            const exec1 = app.newExecutor();
            CommandRouterService.register( asi, exec1 );
            ReactHandlerFace.register( asi, ccm, 'test_handler', exec1 );

            asi.add( ( asi ) => {
                for ( let i = 0; i < 2; ++i ) {
                    ccm.iface( ROUTER_FACE ).registerHandler(
                        asi,
                        'test_handler',
                        [],
                        [],
                        true
                    );
                }

                common_test( asi, app );
            } );
        },
        ( asi, err ) => {
            if ( err === 'AlreadyRegistered' ) {
                asi.success();
            }
        }
    ) );

    it( 'should detected unknown interface on registration', $as_test(
        asi => {
            const app = new ServiceApp( asi );
            asi.add( ( asi ) => {
                app.ccm().iface( ROUTER_FACE ).registerHandler(
                    asi,
                    'test_handler',
                    [ 'abc' ],
                    [ 'EVT' ],
                    false
                );
            } );
        },
        ( asi, err ) => {
            if ( err === 'UnknownInterface' ) {
                asi.success();
            }
        }
    ) );

    it( 'should detected not registered interface', $as_test(
        asi => {
            const app = new ServiceApp( asi );
            asi.add( ( asi ) => {
                app.ccm().iface( ROUTER_FACE ).unRegisterHandler(
                    asi,
                    'test_handler'
                );
            } );
        },
        ( asi, err ) => {
            if ( err === 'NotRegistered' ) {
                asi.success();
            }
        }
    ) );

    it( 'should work in register/unregister cycle', $as_test(
        asi => {
            const app = new ServiceApp( asi );
            const ccm = app.ccm();
            const exec1 = app.newExecutor();
            const exec2 = app.newExecutor();
            const exec3 = app.newExecutor();
            const hand1 = MockHandler.register( asi, exec1 );
            const hand2 = MockHandler.register( asi, exec2 );
            const hand3 = MockHandler.register( asi, exec3 );
            ReactHandlerFace.register( asi, ccm, 'test_handler1', exec1 );
            ReactHandlerFace.register( asi, ccm, 'test_handler2', exec2 );
            ReactHandlerFace.register( asi, ccm, 'test_handler3', exec3 );

            asi.repeat( 3, ( asi, i ) => {
                expect( hand1.count ).equal( i*2*2 );
                expect( hand2.count ).equal( 0 );
                expect( hand3.count ).equal( i*4*2 );
                const router = ccm.iface( ROUTER_FACE );
                router.registerHandler(
                    asi,
                    'test_handler1',
                    [ 'abc', '//sadas' ],
                    [ 'EVT', 'ASDA' ],
                    true
                );
                router.registerHandler(
                    asi,
                    'test_handler2',
                    [ 'abc', '//sadas' ],
                    [ 'EVT', 'ASDA' ],
                    false
                );
                router.registerHandler(
                    asi,
                    'test_handler3',
                    [ 'abc', '//sadas', 't', 'tx', 'txt' ],
                    [ 'EVT', 'ASDA', 'SOME_EVT' ],
                    false
                );
                common_test( asi, app );
                common_test( asi, app );
                asi.add( ( asi, { rsp } ) => {
                    expect( rsp ).equal( 'mock' );
                } );
                router.unRegisterHandler(
                    asi,
                    'test_handler1'
                );
                router.unRegisterHandler(
                    asi,
                    'test_handler2'
                );
                router.unRegisterHandler(
                    asi,
                    'test_handler3'
                );
            } );
        }
    ) );
} );

describe( 'ServerHelpers', function() {
    let app;
    before( $as_test( asi => {
        app = new ServiceApp( asi );
        const ccm = app.ccm();
        const exec1 = app.newExecutor();
        const svc1 = MockServer.register( asi, exec1 );
        ServerFace.register( asi, ccm, `${SERVER_FACE_PREFIX}01234567890123456789ab`, exec1 );
        ccm.alias( `${SERVER_FACE_PREFIX}01234567890123456789ab`, 'test_server' );
    } ) );

    it( 'should fail on missing helpers', $as_test(
        asi => {
            app.ccm().iface( 'test_server' ).helpers();
        },
        ( asi, err ) => {
            if ( err === 'TooEarlyHelpers' ) {
                asi.success();
            }
        }
    ) );

    it( 'should have default implementation', $as_test( asi => {
        ServerHelpers.setDriver( 'mock', new ServerHelpers );
        const helpers = app.ccm().iface( 'test_server' ).helpers();

        expect( helpers.bold( 'txt' ) ).equal( 'txt' );
        expect( helpers.italic( 'txt' ) ).equal( 'txt' );
        expect( helpers.color( 'txt', 'aabbcc' ) ).equal( 'txt' );
        expect( helpers.imgUrl( 'txt' ) ).equal( 'txt' );
        expect( helpers.emoji( 'txt' ) ).equal( '(txt)' );
        expect( helpers.line() ).equal( '\n' );
        expect( helpers.menion( 'txt' ) ).equal( '@txt' );
    } ) );
} );
