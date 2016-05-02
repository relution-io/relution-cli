# Relution CLI 1.0
Protokoll:April 26, 2016 11:35 AM
- use hjson 


## Installation
```bash
$: npm install -g relution-cli
```

## Update
```bash
$: npm update -g relution-cli
```

## Uninstall
```bash
$: npm uninstall -g relution-cli
```

## Help
```bash
$: relution
$relution: help
```

## Developer Management
- [create a profile](#create-4)
- [update your profile](#update-5)
- [delete your profile](#delete-1)

## Server Management
- [add a server configuration](#create-3)
- [update a server configuration](#update-4)
- [remove a server configuration](#delete)
- [list server configurations](#list)

## BaaS Services
- [generate a new BaaS App project](#new)
- [define environment variables for different server configurations](#environment)
- [add a connector to a backend system](#connection)
- [add a Model](#model)
- [start live logger with a given log level](#logger)
- [open a remote debugger for a deployed application](#debugger)

### File Structure
```bash
├── app.js
├── package.json
├── relution.hjson
├── .editorconfig
├── .relutionignore
├── .gitignore
├── README.md
├── CHANGELOG.md
├── docs
├── samples
├── utils
├─┬ models
│ ├── Account.hjson
│ ├── Contact.hjson
├─┬ env
│ ├── dev.hjson
│ ├── prod.hjson
├─┬ connections
│ ├── exchange-ews.hjson
│ ├─┬ sap
│ 	├── sap.hjson
│ 	├─┬ geocoding
│ 	  ├── geocoding.hjson
├─┬ push
│ ├── app.hjson
├─┬ routes
│ ├── account.js
```

### Commands:

| command | subcommand | vars |
|--------|--------|--------|
| [relution](#relution)    | -- |	-- |
| relution | help  | --	|
| relution | quit  | --	|
| | | |
| [new](#new)    |  |	<$name> |
| new | help  | --	|
| new | quit  | --	|
| | | |
| [env](#environment)    | create  |	<$name> |
| env    | update  |	<$name> |
| env    | copy  | <$from> <$to>|
| env | help  | --	|
| env | quit  | --	|
| | | |
|[push](#push)    | create  | <$name> |
| push    | update  | <$name> |
| push | help  | --	|
| push | quit  | --	|
| | | |
| [connection](#connection)    | create  |	<$path/$name> <$server> |
| connection    | api-list | --filter=<$Filter> --server=<$name>|
| connection | help  | --	|
| connection | quit  | --	|
| | | |
| [model](#model) | create   | <$name>	<$attributes>|
| model | update   | <$name>	|
| model | attribute   | <$name>	|
| model | rm   |<$name>	|
| model | help |-- |
| model | quit | --|
| | | |
| [server](#server) | create  | <$name>	|
| server | update  | <$name> |
| server | rm  | <$name>	|
| server | list  | <$name>	|
| server | help  | --	|
| server | quit  | --	|
| | | |
| [deploy](#deploy) |   | --env=<$name>	--server=<$name>|
| deploy | help |-- |
| deploy | quit | --|
| | | |
| [debugger](#debugger) |   | <$server>	|
| debugger | help |-- |
| debugger | quit | --|
| | | |
| [logger](#logger) |   | <$server>	<$level>|
| logger | help |-- |
| logger | quit | --|
| | | |
| [user](#user) | create   | <$name>	|
| user | update   | <$name>	|
| user | rm   | <$name>	|
| user | help |-- |
| user | quit | --|

# Commands:
---

## Relution
---
[top](#relution-cli-10) | [commands](#commands)

| command | subcommand | vars |
|--------|--------|--------|
| relution    | -- |	-- |
| relution | help  | --	|
| relution | quit  | --	|


```bash
$: relution
$relution: 'Welcome back <$name>'

#or
 
$relution: 'Hi this is your first time using the relution cli. Great!'
$relution: 'Please enter your username:'
$relution: 'Please choose a language:'
          x 'English'
          o 'Deutsch'
$relution: 'Thank you and welcome to the Relution Cli <$username>'
```
Enter to the Relution Command Area.

# Relution SubCommands:

## New:
---
[top](#relution-cli-10) | [commands](#commands)

| command | subcommand | vars |
|--------|--------|--------|
| new    |  |	<$name> |
| new | help  | --	|
| new | quit  | --	|

```bash
$relution: new
$relution: 'please enter a Name'
$relution: 'Sure create a project in ${__dirname} ${<$name>} ? y/N'
$relution: 'create project'
$relution: cd into <$name>
$relution: npm install
$relution: 'project ${<$name>} are created'

#or

$relution: new myApp
$relution: 'Sure create a project in ${__dirname} ${<$name>} ? y/N'
$relution: 'create project'
$relution: cd into <$name>
$relution: npm install
$relution: 'project ${<$name>} are created'

```

> The BaaS Boilerplate is now created in your folder 'myApp'

```bash
├── app.js
├── package.json
├── relution.hjson
├── .editorconfig
├── .relutionignore
├── .gitignore
├── README.md
├── CHANGELOG.md
├── docs
├─┬ models
│ ├── .gitkeep
├─┬ env
│ ├── .gitkeep
├─┬ connections
│ ├── .gitkeep
├─┬ routes
│ ├── .gitkeep
```


## Environment:
---
[top](#relution-cli-10) | [commands](#commands)

| command | subcommand | vars |
|--------|--------|--------|
| env    | create  | <$name> |
| env    | update  | <$name> |
| env    | copy  | <$from> <$to>|
| env | help  | --	|
| env | quit  | --	|

The Environment Files are your Key/Value Store and can be used as templates variables in other hjson Files.

> Notice: these Keys are not available in files from the folder 'env'
> name is reserved and can not be set

### Create:

```bash
$relution: env create
$relution: 'please enter a Name for your Environment'
$relution: 'add a Key'
$relution: 'add a Value for <$key>'
$relution: 'env/<$name>.hjson are created'

#or
 
$relution: env create dev
$relution: 'add a Key'
$relution: 'add a Value for <$key>'
$relution: 'env/<$name>.hjson are created'
```

Generate a <$name>.hjson in the folder 'env'.

```bash
├─┬ env
│ ├── dev.hjson
```
 
and looks like this

```json
//env/dev.hjson
{
  "name": "dev",
  "<$key>": "<$value>"
}
...
```
These keys can be used as a template variable.

 ##### Example:
 
//env/dev.hjson
```json
{
  "myTimeout": "120000"
}
```
no you can use the "myTimeout" in other hjson files like this 

//connections/account.hjson
```json
{
  "http.server.timeout": '${myTimeout}'
}
```



### Update:

```bash
$relution: env update
$relution: 'Please choose a environment'
$relution: 'add a Key'
$relution: 'add a Value for <$key>'
$relution: 'env/<$name>.hjson are updated'

#or

$relution: env update <$name>
$relution: 'add a Key'
$relution: 'add a Value for <$key>'
$relution: 'env/<$name>.hjson are updated'
```
Add a new key value pair to your Environment.

### Copy:

```bash
$relution: env copy
$relution: 'Please choose a environment'
$relution: 'Please enter a name:'
$relution: 'env/<$name>.hjson are created'

#or

$relution: env copy <$from> <$to>
$relution: 'env/<$name>.hjson are created'
```
##### Example:

before:
```bash
├─┬ env
│ ├── dev.hjson
```

```bash
$relution: env copy dev prod
```

after:
```bash
├─┬ env
│ ├── dev.hjson
│ ├── prod.hjson
```


## Connection:
---
[top](#relution-cli-10) | [commands](#commands)

| command | subcommand | vars |
|--------|--------|--------|
| connection    | create  |	<$path/$name> <$server> |
| connection    | api-list | --filter=<$Filter> --server=<$name>|
| connection | help  | --	|
| connection | quit  | --	|

All hjson files in the folder 'connections' are connections.
> Notice if you change or create someone you have always to deploy it to your Relution Server to get the changes. 

### Create:

```bash
$relution: connection create
$relution: 'Please choose a Server:'
$relution: 'Please enter name or an / sep path ('/<$path>/<$name>')'
$relution: 'Please enter a Description or press enter:'
$relution: 'Connect to Relution Server <$server> ...'
$relution: 'Please choose your Connection Type :'
$relution: 'Please choose your Connection Provider :'
$relution: 'Connection are still created Please Deploy it'
$relution: 'Please enter the <$property> value (<$typeof>):'

#or

$relution: connection create '/ews/ews-exchange' prod
$relution: 'Please enter a Description or press enter:'
$relution: 'Connect to Relution Server <$server> ...'
$relution: 'Please choose your Connection Type :'
$relution: 'Please choose your Connection Provider :'
$relution: 'Please enter the <$property> value (<$typeof>):'
$relution: 'Connection are still created Please Deploy it'
```

Generate the configured Connection

```bash
├─┬ connections
│ ├─┬ ews
│ 	├── ews-exchange.hjson
```

and looks something like this

```json
{
  /*
  * The name of your connection
  */
  "name": "ews-exchange",
  /*
  * The description of your connection
  */
  "description": "SOAP WebService",
  /*
  * The connectorProvider of your Connection please be carefull if you change ite manual
  */
  "connectorProvider": "Intranet HTTP(S)",
  /*
  * The connectorType of your Connection please be carefull if you change ite manual
  */
  "type": "SOAP",
  "descriptor": "${descriptor}",
  /*
  * all availables properties
  */
  "properties": {
    "authentication": "Basic",
    "soapVersion": "SOAP_1_2",
    "messageSuffix": "Message",
    "http.socket.timeout": "${}", // must match timeout on SAP side
    "http.response.limit": "67108864" // 64MB
  },
  "calls":  {}
}

...
```

| command | subcommand | vars |
|--------|--------|--------|
| connection    | api-list |--name=<$name> --server=<$server> --filter=<$Filter>|
### List Api:

Here you can generate a Connection in communication with your Relution Server. You need to be online for this! 

```bash
$relution: connection api-list
$relution: 'Please choose a Server:'
$relution: 'Please choose a Connection'
$relution: 'Connect to Relution Server <$server> ...'
$relution: 'Please enter a Filter (GET Account) or Press enter:'
$relution: 'Please choose calls:'
$relution: 'Please enter name for the <$call>:'
$relution: 'Calls are added to <$name>'

#or

$relution: connection api-list --name=<$name> --server=<$name> --filter=<$Filter>
```

example: 
```bash
$relution: connection api-list --name=account --server=local --filter=GET Account
$reluiton: x 'MOBILE_SST_NEW/_-DK_-KP_MOB_DEMANDORDER_GET'
$relution: 'Please enter a name for MOBILE_SST_NEW/_-DK_-KP_MOB_DEMANDORDER_GET:'
$relution: ''
```
the calls are added to your 'connections/account.hjson' 
```json
 "calls":  {
    /**
    * @inputModel: _KP_MOB_DEMANDORDER_GETMessage
    * @outpuModel: MOBILE_SST_NEW/_-DK_-KP_MOB_DEMANDORDER_GET
    */
    "getAccount": "MOBILE_SST_NEWNEW/_-KP_MOB_DEMANDORDER_GET",
```

and in your 'connection/account.js' the cli add the connector call at the bottom of your file.

```javascript
/**
 * call: getAccount 
 * @inputModel: _KP_MOB_DEMANDORDER_GETMessage
 * @outpuModel: MOBILE_SST_NEW/_-DK_-KP_MOB_DEMANDORDER_GET
 */
module.exports.getTasks = function(input) {
  return connector.runCall(
    'account',
    'getAccount',//MOBILE_SST_NEW/__-KP_MOB_DEMANDORDER_GET
    ,input
  );
}
```

## Push:
---
[top](#relution-cli-10) | [commands](#commands)

| command | subcommand | vars |
|--------|--------|--------|
| push    | create  | <$name> |
| push | help  | --	|
| push | quit  | --	|


### Create:

```bash
$relution: push create app
```
Add a 'app.hjson' config file in your folder push

```bash
├─┬ push
│ ├── app.hjson
```
and looks something like this.

```json
//push/app.hjson
{
    "name": "app",
    "apns" :
...
```

## Server:
---
[top](#relution-cli-10) | [commands](#commands)

| command | subcommand | vars |
|--------|--------|--------|
| server | create  | <$name>	|
| server | update  | <$name> |
| server | delete  | <$name>	|
| server | list  | <$name>	|
| server | help  | --	|
| server | quit  | --	|

The User Server Management

### Create

add a server configuration.

```bash
$relution: server create
$relution : 'Please enter the Server name':
$relution : 'Please enter the Server url':
$relution : 'Please enter the Server username':
$relution : 'Please enter the Server password':
$relution : 'Set as Default? Y/N:':

#or

$relution: server create <$name>
$relution : 'Please enter the Server url':
$relution : 'Please enter the Server username':
$relution : 'Please enter the Server password':
$relution : 'Set as Default? Y/N:':
```

### Update

update a server configuration

```bash
$relution: server update
$relution: o server1
		   o server2
#or
$relution: server update <$name>

$relution : 'Please update the Server name or press enter':
$relution : 'Please update the Server url or press enter':
$relution : 'Please update the Server username or press enter':
$relution : 'Please update the Server password or press enter':
$relution : 'Set as Default? Y/N or press enter':
```

### Delete

remove a server configuration

```bash
$relution: server rm
$relution: o server1
		   o server2
#or

$relution: server rm <$name>
```
### List

list server configurations

```bash
$relution: server list
$relution: o server1
		   o server2
╔════════════════╤═════════╤══════════╤══════════════════════════════════════════╗
║ Server         │ Default │ Option   │ Value                                    ║
╟────────────────┼─────────┼──────────┼──────────────────────────────────────────╢
║ cordev         │    ✖    │ baseurl  │ https://coredev.mwaysolutions.com        ║
╟────────────────┼─────────┼──────────┼──────────────────────────────────────────╢
║                │         │ username │ p.brewing                                ║
╟────────────────┼─────────┼──────────┼──────────────────────────────────────────╢
║ local-approval │    ✖    │ baseurl  │ http://192.168.99.100:8080/              ║
╟────────────────┼─────────┼──────────┼──────────────────────────────────────────╢
║                │         │ username │ ibx-user                                 ║
╚════════════════╧═════════╧══════════╧══════════════════════════════════════════╝

#or

$relution: server list <$name>

╔════════════════╤═════════╤══════════╤══════════════════════════════════════════╗
║ Server         │ Default │ Option   │ Value                                    ║
╟────────────────┼─────────┼──────────┼──────────────────────────────────────────╢
║ local-approval │    ✖    │ baseurl  │ http://192.168.99.100:8080/              ║
╟────────────────┼─────────┼──────────┼──────────────────────────────────────────╢
║                │         │ username │ ibx-user                                 ║
╚════════════════╧═════════╧══════════╧══════════════════════════════════════════╝
```

## Deploy:
---
[top](#relution-cli-10) | [commands](#commands)

| command | subcommand | vars |
|--------|--------|--------|
| deploy |   | --env=<$name>	--server=<$name>|
| deploy | help |-- |
| deploy | quit | --|
| | | |
```bash
$relution: deploy
$relution: 'Please choose a Environment:'
$relution: o default
		   o env1
		   o env2
$relution: 'Please choose a Server:'
$relution: o default
		   o server1
		   o server2
$relution : .... "deployment succeeded"

#or

$relution: deploy --env=<$name>
$relution: 'Please choose a Server:'
$relution: o default
		   o server1
		   o server2
$relution : .... "deployment succeeded"

#or

$relution: deploy --env=<$name> --server=<$name>
$relution : .... "deployment succeeded"
```
Prepare your Project for the Relution and send it.

## Logger:
---
[top](#relution-cli-10) | [commands](#commands)

| command | subcommand | vars |
|--------|--------|--------|
| logger |   | <$server>	<$level>|
| logger | help |-- |
| logger | quit | --|
```bash
$relution: logger
$relution: 'Please choose a Server:'
$relution: o default
		   o server1
		   o server2
$relution : 'Please choose a level:'
$relution: o default
		   o error
....

#or

$relution: logger local trace
```
Show a dynamic list of Server logs.

![logger](https://raw.githubusercontent.com/yaronn/blessed-contrib/master/docs/images/log.gif)


## Debugger:
---
[top](#relution-cli-10) | [commands](#commands)

| command | subcommand | vars |
|--------|--------|--------|
| debugger |   | <$server>	|
| debugger | help |-- |
| debugger | quit | --|
```bash
$relution: debugger
$relution: 'Please choose a Server:'
$relution: o default
		   o server1
		   o server2
....

#or

$relution: debugger local
```
open your Serverside Project on Node Inspector

## User:
---
[top](#relution-cli-10) | [commands](#commands)

| command | subcommand | vars |
|--------|--------|--------|
| user | create   | <$name>	|
| user | update   | --	|
| user | rm   | --	|
| user | help |-- |
| user | quit | --|

### Create:
```bash
$relution: user create
$relution: 'Please enter your Name:'
$relution: 'Please choose your Language:'
$relution: 'Please choose your default logger level:'
$relution: o error
		       o debug ..
#or

$relution: user create relUser
$relution: 'Please choose your Language:'
$relution: 'Please choose your default logger level:'
$relution: o error
		       o debug ..
```

Create a simple User Profile in the User "Home" Folder in file '.relutionrc'.

### Update:

```bash
$relution: user update
$relution: 'Please enter your Name or press enter:'
...
```
Update the User Profile.

## Model:
---
[top](#relution-cli-10) | [commands](#commands)

| command | subcommand | vars |
|--------|--------|--------|
| model | create   | <$name>	<$attributes>|
| model | update   | <$name>	|
| model | attribute   | <$name>	|
| model | rm   |<$name>	|
| model | help |-- |
| model | quit | --|

All 'hjson' files in the models folder are Models Skeletons. 

### Create:
```bash
$relution: model create
$relution: 'Please enter your Modelname:'
$relution: 'Please enter your label or press enter:'
$relution: 'Please enter your description or press enter:'
$relution: 'You want add a attribute ?':
$relution: 'Choose Type':
...
```
Fo a quick model generating you can set a name and attributes with comma seperator. 
The first attribute are added as id Attribute and is mandatory all other keys simpe added as string.
To edit it open the File in your Ide. 

```bash 
$relution: model create <$name='Accounts'> <$attributes='id,name,lastName,firstName,email'>
....
```

You get the following files: 

```bash
├─┬ models
│ ├── Account.hjson
│ ├── Account.js
│ ├── Account.spec.js
├─┬ routes
│ ├── account.js
```
 
Model in /models/Account.hjson

```json
{
  "name": "Account",
  "label": "Account",
  "description": "Account auto generated description",
  "attributes": [
    {
      "name": "id",
      "type": "String",
      "mandatory": true,
      "key": true
    },
    {
      "name": "name",
      "type": "String",
      "mandatory": false,
      "key": false
    },
```

You Model js file

```js
'use strict';
var backbone = require('backbone');
var datasync = require('../utils/datasync.js');

/**
 * module providing CRUD of Account objects.
 */
module.exports = {
  entity: 'Account',
  type: {
    model: 'Account'
  },
  defaults: {
    id: '',
    name: '',
    lastName: ''
  },
  tenancy: 'USER',
  idAttribute: 'id',
  aclAttribute: null,
  backbone: backbone,
  sync: datasync.sync,
  backend: new datasync.Backend({
  })
};

// backbone setup
module.exports.Model = backbone.Model.extend(module.exports);
module.exports.model = module.exports.Model; // backbone wants lower case
module.exports.Collection = backbone.Collection.extend(module.exports);
```
The Model test file models/Account.spec.js

```js
describe('Account Model', function () {
  it('Account model has attributes', function () {
    ...
```

the express also are added routes/accounts.js
```js
app.use('accounts/:id')... 
```

### Update:
```bash
$relution: model update
$relution: 'Please choose your Model:'
$relution: 'Choose Model':
$relution: 'Please enter your Modelname or press enter:'
$relution: 'Please enter your label or press enter:'
$relution: 'Please enter your description or press enter:'
$relution: 'You want update a attribute ?':
$relution: 'Choose attribute':

#or

$relution: model update Account
$relution: 'Please enter your Modelname or press enter:'
$relution: 'Please enter your label or press enter:'
$relution: 'Please enter your description or press enter:'
$relution: 'You want update a attribute ?':
$relution: 'Choose attribute':
...
```
Update a model.


### Attribute:
```bash
$relution: model attribute
$relution: 'Please choose your Model:'
$relution: 'Choose Type':

#or

$relution: model attribute Account
$relution: 'Choose Type':
...
```

Add a new Attribute on your Model.

### Delete:

```bash
$relution: model rm
$relution: 'Please choose your Model:'
$relution: 'Sure you want delete this model ? y/n:'

#or

$relution: model rm Account
$relution: 'Sure you want delete Account model ? y/n:'
...
```
