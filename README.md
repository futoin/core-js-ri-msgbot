
# About

**WORK IN PROGRESS**


Reference implementation of:
 
    FTN22: FutoIn Interface - Message Bot
    Version: 0.x
    
* Spec: [FTN22: FutoIn Interface - Message Bot](https://specs.futoin.org/draft/preview/ftn22_if_message_bot.html)

Author: [Andrey Galkin](mailto:andrey@futoin.org)


# Installation for Node.js

Command line:
```sh
$ npm install @futoin/msgbot --save
```

    
# API documentation

## Classes

<dl>
<dt><a href="#CommandRouterFace">CommandRouterFace</a></dt>
<dd><p>FTN22: Command Router Face</p>
</dd>
<dt><a href="#CommandRouterService">CommandRouterService</a></dt>
<dd><p>Command Router Service</p>
</dd>
<dt><a href="#PushHandlerFace">PushHandlerFace</a></dt>
<dd><p>FTN22: Push Handler Face</p>
</dd>
<dt><a href="#PushHandlerService">PushHandlerService</a></dt>
<dd><p>Push Handler Service base</p>
</dd>
<dt><a href="#PushRouterService">PushRouterService</a></dt>
<dd><p>Push Router Service base</p>
</dd>
<dt><a href="#ReactHandlerFace">ReactHandlerFace</a></dt>
<dd><p>FTN22: React Handler Face</p>
</dd>
<dt><a href="#ReactHandlerService">ReactHandlerService</a></dt>
<dd><p>React Handler Service base</p>
</dd>
<dt><a href="#ServerFace">ServerFace</a></dt>
<dd><p>FTN22: Server Face</p>
</dd>
<dt><a href="#ServerHelpers">ServerHelpers</a></dt>
<dd><p>FTN22: Server-specific helpers</p>
</dd>
<dt><a href="#ServerService">ServerService</a></dt>
<dd><p>Server Service</p>
</dd>
<dt><a href="#ServiceApp">ServiceApp</a></dt>
<dd><p>Basic bot service app.</p>
<p>Actual bot implementation is expected to inherit this class and override
registration functions.</p>
</dd>
<dt><a href="#BaseFace">BaseFace</a></dt>
<dd><p>Base Face with neutral common registration functionality</p>
</dd>
<dt><a href="#BaseService">BaseService</a></dt>
<dd><p>Base Service with common registration logic</p>
</dd>
</dl>

<a name="CommandRouterFace"></a>

## CommandRouterFace
FTN22: Command Router Face

**Kind**: global class  
<a name="CommandRouterService"></a>

## CommandRouterService
Command Router Service

**Kind**: global class  
<a name="new_CommandRouterService_new"></a>

### new CommandRouterService(options)
C-tor


| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | passed to superclass c-tor |

<a name="PushHandlerFace"></a>

## PushHandlerFace
FTN22: Push Handler Face

**Kind**: global class  
<a name="PushHandlerService"></a>

## PushHandlerService
Push Handler Service base

**Kind**: global class  
<a name="PushRouterService"></a>

## PushRouterService
Push Router Service base

**Kind**: global class  
<a name="ReactHandlerFace"></a>

## ReactHandlerFace
FTN22: React Handler Face

**Kind**: global class  
<a name="ReactHandlerService"></a>

## ReactHandlerService
React Handler Service base

**Kind**: global class  
<a name="ServerFace"></a>

## ServerFace
FTN22: Server Face

**Kind**: global class  

* [ServerFace](#ServerFace)
    * _instance_
        * [.getFlavour(asi)](#ServerFace+getFlavour)
        * [.helpers()](#ServerFace+helpers) ⇒ [<code>ServerHelpers</code>](#ServerHelpers)
        * [.systemIface()](#ServerFace+systemIface)
    * _static_
        * [.register(asi, ccm, name, endpoint, [credentials], [options])](#ServerFace.register)

<a name="ServerFace+getFlavour"></a>

### serverFace.getFlavour(asi)
Get type of database

**Kind**: instance method of [<code>ServerFace</code>](#ServerFace)  

| Param | Type | Description |
| --- | --- | --- |
| asi | <code>AsyncSteps</code> | steps interface |

<a name="ServerFace+helpers"></a>

### serverFace.helpers() ⇒ [<code>ServerHelpers</code>](#ServerHelpers)
Get native server helpers

**Kind**: instance method of [<code>ServerFace</code>](#ServerFace)  
**Returns**: [<code>ServerHelpers</code>](#ServerHelpers) - - driver implementation  
<a name="ServerFace+systemIface"></a>

### serverFace.systemIface()
Get native message system interface implementation

**Kind**: instance method of [<code>ServerFace</code>](#ServerFace)  
<a name="ServerFace.register"></a>

### ServerFace.register(asi, ccm, name, endpoint, [credentials], [options])
CCM registration helper

**Kind**: static method of [<code>ServerFace</code>](#ServerFace)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| asi | <code>AsyncSteps</code> |  | steps interface |
| ccm | <code>AdvancedCCM</code> |  | CCM instance |
| name | <code>string</code> |  | CCM registration name |
| endpoint | <code>\*</code> |  | see AdvancedCCM#register |
| [credentials] | <code>\*</code> | <code></code> | see AdvancedCCM#register |
| [options] | <code>object</code> | <code>{}</code> | interface options |
| [options.version] | <code>string</code> | <code>&quot;&lt;latest&gt;&quot;</code> | interface version to use |

<a name="ServerHelpers"></a>

## ServerHelpers
FTN22: Server-specific helpers

**Kind**: global class  

* [ServerHelpers](#ServerHelpers)
    * _instance_
        * [.bold(str)](#ServerHelpers+bold) ⇒ <code>string</code>
        * [.italic(str)](#ServerHelpers+italic) ⇒ <code>string</code>
        * [.color(str, hexcolor)](#ServerHelpers+color) ⇒ <code>string</code>
        * [.imgUrl(url)](#ServerHelpers+imgUrl) ⇒ <code>string</code>
        * [.emoji(name)](#ServerHelpers+emoji) ⇒ <code>string</code>
        * [.line()](#ServerHelpers+line) ⇒ <code>string</code>
        * [.menion(ext_id)](#ServerHelpers+menion) ⇒ <code>string</code>
    * _static_
        * [.setDriver(flavour, impl)](#ServerHelpers.setDriver)
        * [.getDriver(flavour)](#ServerHelpers.getDriver) ⇒ [<code>ServerHelpers</code>](#ServerHelpers)

<a name="ServerHelpers+bold"></a>

### serverHelpers.bold(str) ⇒ <code>string</code>
Get bold text

**Kind**: instance method of [<code>ServerHelpers</code>](#ServerHelpers)  
**Returns**: <code>string</code> - bold output  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | input |

<a name="ServerHelpers+italic"></a>

### serverHelpers.italic(str) ⇒ <code>string</code>
Get italic text

**Kind**: instance method of [<code>ServerHelpers</code>](#ServerHelpers)  
**Returns**: <code>string</code> - italic output  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | input |

<a name="ServerHelpers+color"></a>

### serverHelpers.color(str, hexcolor) ⇒ <code>string</code>
Get colored text

**Kind**: instance method of [<code>ServerHelpers</code>](#ServerHelpers)  
**Returns**: <code>string</code> - colored output  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | input |
| hexcolor | <code>string</code> | color code |

<a name="ServerHelpers+imgUrl"></a>

### serverHelpers.imgUrl(url) ⇒ <code>string</code>
Get image URL embedded into text

**Kind**: instance method of [<code>ServerHelpers</code>](#ServerHelpers)  
**Returns**: <code>string</code> - URL output  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | input |

<a name="ServerHelpers+emoji"></a>

### serverHelpers.emoji(name) ⇒ <code>string</code>
Get emoji embedded into text

**Kind**: instance method of [<code>ServerHelpers</code>](#ServerHelpers)  
**Returns**: <code>string</code> - emoji output  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | input |

<a name="ServerHelpers+line"></a>

### serverHelpers.line() ⇒ <code>string</code>
Get new line

**Kind**: instance method of [<code>ServerHelpers</code>](#ServerHelpers)  
**Returns**: <code>string</code> - new line  
<a name="ServerHelpers+menion"></a>

### serverHelpers.menion(ext_id) ⇒ <code>string</code>
Get actor mention into text

**Kind**: instance method of [<code>ServerHelpers</code>](#ServerHelpers)  
**Returns**: <code>string</code> - mention output  

| Param | Type | Description |
| --- | --- | --- |
| ext_id | <code>string</code> | input actor ID |

<a name="ServerHelpers.setDriver"></a>

### ServerHelpers.setDriver(flavour, impl)
Add native helper driver

**Kind**: static method of [<code>ServerHelpers</code>](#ServerHelpers)  

| Param | Type | Description |
| --- | --- | --- |
| flavour | <code>string</code> | system flavour |
| impl | [<code>ServerHelpers</code>](#ServerHelpers) | driver implementation |

<a name="ServerHelpers.getDriver"></a>

### ServerHelpers.getDriver(flavour) ⇒ [<code>ServerHelpers</code>](#ServerHelpers)
Get native helper driver

**Kind**: static method of [<code>ServerHelpers</code>](#ServerHelpers)  
**Returns**: [<code>ServerHelpers</code>](#ServerHelpers) - driver implementation  

| Param | Type | Description |
| --- | --- | --- |
| flavour | <code>string</code> | system flavour |

<a name="ServerService"></a>

## ServerService
Server Service

**Kind**: global class  
<a name="ServiceApp"></a>

## ServiceApp
Basic bot service app.

Actual bot implementation is expected to inherit this class and override
registration functions.

**Kind**: global class  

* [ServiceApp](#ServiceApp)
    * [new ServiceApp(asi, options)](#new_ServiceApp_new)
    * [.ccm()](#ServiceApp+ccm) ⇒ <code>AdvancedCCM</code>
    * [.executor()](#ServiceApp+executor) ⇒ <code>Executor</code>
    * [.close([done])](#ServiceApp+close)
    * [.newExecutor()](#ServiceApp+newExecutor) ⇒ <code>Executor</code>
    * *[._register_uuidsvc(asi)](#ServiceApp+_register_uuidsvc)*
    * *[._register_handlers(asi)](#ServiceApp+_register_handlers)*
    * *[._register_servers(asi)](#ServiceApp+_register_servers)*

<a name="new_ServiceApp_new"></a>

### new ServiceApp(asi, options)
C-tor


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| asi | <code>AsyncSteps</code> |  | AsyncSteps interface |
| options | <code>object</code> | <code>{}</code> | options |
| [options.ccm] | <code>AdvancedCCM</code> |  | external CCM instance |
| [options.executor] | <code>Executor</code> |  | external executor instance |
| [options.ccmOptions] | <code>object</code> |  | auto-CCM options |
| [options.notExpectedHandler] | <code>callable</code> |  | 'notExpected' error handler |
| [options.executorOptions] | <code>object</code> |  | private auto-Executor options |

<a name="ServiceApp+ccm"></a>

### serviceApp.ccm() ⇒ <code>AdvancedCCM</code>
CCM instance accessor

**Kind**: instance method of [<code>ServiceApp</code>](#ServiceApp)  
**Returns**: <code>AdvancedCCM</code> - instance  
<a name="ServiceApp+executor"></a>

### serviceApp.executor() ⇒ <code>Executor</code>
Executor instance accessor

**Kind**: instance method of [<code>ServiceApp</code>](#ServiceApp)  
**Returns**: <code>Executor</code> - instance  
<a name="ServiceApp+close"></a>

### serviceApp.close([done])
Shutdown of app and related instances

**Kind**: instance method of [<code>ServiceApp</code>](#ServiceApp)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [done] | <code>callable</code> | <code></code> | done callback |

<a name="ServiceApp+newExecutor"></a>

### serviceApp.newExecutor() ⇒ <code>Executor</code>
Create an instance of executor which is useful to register
services.

**Kind**: instance method of [<code>ServiceApp</code>](#ServiceApp)  
**Returns**: <code>Executor</code> - instance  
<a name="ServiceApp+_register_uuidsvc"></a>

### *serviceApp.\_register\_uuidsvc(asi)*
Override to register custom UUID service

**Kind**: instance abstract method of [<code>ServiceApp</code>](#ServiceApp)  

| Param | Type | Description |
| --- | --- | --- |
| asi | <code>AsyncSteps</code> | AsyncSteps interface |

<a name="ServiceApp+_register_handlers"></a>

### *serviceApp.\_register\_handlers(asi)*
Override to register custom business logic.

**Kind**: instance abstract method of [<code>ServiceApp</code>](#ServiceApp)  

| Param | Type | Description |
| --- | --- | --- |
| asi | <code>AsyncSteps</code> | AsyncSteps interface |

<a name="ServiceApp+_register_servers"></a>

### *serviceApp.\_register\_servers(asi)*
Override to register servers.

**Kind**: instance abstract method of [<code>ServiceApp</code>](#ServiceApp)  

| Param | Type | Description |
| --- | --- | --- |
| asi | <code>AsyncSteps</code> | AsyncSteps interface |

<a name="BaseFace"></a>

## BaseFace
Base Face with neutral common registration functionality

**Kind**: global class  
**Note**: Not official API  

* [BaseFace](#BaseFace)
    * [.LATEST_VERSION](#BaseFace.LATEST_VERSION)
    * [.PING_VERSION](#BaseFace.PING_VERSION)
    * [.register(as, ccm, name, endpoint, [credentials], [options])](#BaseFace.register)

<a name="BaseFace.LATEST_VERSION"></a>

### BaseFace.LATEST\_VERSION
Latest supported FTN13 version

**Kind**: static property of [<code>BaseFace</code>](#BaseFace)  
<a name="BaseFace.PING_VERSION"></a>

### BaseFace.PING\_VERSION
Latest supported FTN4 version

**Kind**: static property of [<code>BaseFace</code>](#BaseFace)  
<a name="BaseFace.register"></a>

### BaseFace.register(as, ccm, name, endpoint, [credentials], [options])
CCM registration helper

**Kind**: static method of [<code>BaseFace</code>](#BaseFace)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| as | <code>AsyncSteps</code> |  | steps interface |
| ccm | <code>AdvancedCCM</code> |  | CCM instance |
| name | <code>string</code> |  | CCM registration name |
| endpoint | <code>\*</code> |  | see AdvancedCCM#register |
| [credentials] | <code>\*</code> | <code></code> | see AdvancedCCM#register |
| [options] | <code>object</code> | <code>{}</code> | interface options |
| [options.version] | <code>string</code> | <code>&quot;1.0&quot;</code> | interface version to use |

<a name="BaseService"></a>

## BaseService
Base Service with common registration logic

**Kind**: global class  

* [BaseService](#BaseService)
    * [new BaseService(options)](#new_BaseService_new)
    * [.register(as, executor, options)](#BaseService.register) ⇒ [<code>BaseService</code>](#BaseService)

<a name="new_BaseService_new"></a>

### new BaseService(options)
C-tor


| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | passed to superclass c-tor |

<a name="BaseService.register"></a>

### BaseService.register(as, executor, options) ⇒ [<code>BaseService</code>](#BaseService)
Register Service with Executor

**Kind**: static method of [<code>BaseService</code>](#BaseService)  
**Returns**: [<code>BaseService</code>](#BaseService) - instance  

| Param | Type | Description |
| --- | --- | --- |
| as | <code>AsyncSteps</code> | steps interface |
| executor | <code>Executor</code> | executor instance |
| options | <code>object</code> | implementation defined options |



*documented by [jsdoc-to-markdown](https://github.com/75lb/jsdoc-to-markdown)*.


