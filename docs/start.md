# Getting started
In order to use the module you need to connect it to your code:
```js
const GeometryDash = require('geometry-dash-api');

const Server = new GeometryDash({
  server: 'http://fakeman-cat.tk:1234/server', // My server :D
  userName: 'Fakeman Cat',
  password: 'Password'
});
```
The module is designed for all game servers, so you can specify the server parameter.</br>
This parameter can be omitted, then it will be the default: http://www.boomlings.com/database
#
