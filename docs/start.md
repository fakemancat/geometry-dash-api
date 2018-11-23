# Getting started
In order to use the module you need to connect it to your code:
```js
const GDClient = require('geometry-dash-api');

const client = new GDClient({
  server: 'http://fakeman-cat.tk:1234/server', // My server :D
  userName: 'Fakeman Cat',
  password: 'Password'
});
```

Also, just in case there is a method setOptions based on ```Object.assign```:
```js
client.setOptions({
  password: 'asdasd',
  accountID: 71
});
```

The module is designed for all game servers, so you can specify the server parameter.</br>
This parameter can be omitted, then it will be the default: http://www.boomlings.com/database
#
