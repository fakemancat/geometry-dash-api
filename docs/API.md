# Using the server API
Get API methods:
```js
const { api } = Server;
```
To start before using the API you need to log in:
```js
(async() => {
  api.login();
  
  const user = await api.users.getById(71);
  console.log(user); // => object
})()
```
Any asynchronous function is required.</br>
For each asynchronous function, you need to login:
```js
(async() => { // 1
  api.login();
  
  /* Any action with the API */
})();

(async() => { // 2
  api.login();
  
  /* Any action with the API */
})();

// ...
```
# API methods
## Users
For information on user ID:
```js
api.users.getById(accountID); // => Promise<Object>
```

For information on user nick:
```js
api.users.getByNick(accountID); // => Promise<Object>
```
## Friends
To send requests to your friends in someone's ID:
```js
api.friends.addRequest(accountID, message); // => If successful: Promise<Boolean>
```
## Levels
For information of level on ID:
```js
api.levels.getById({ params }); // => Promise<Object>
```
Possible params:
```js
levelString // Boolean
levelID // Number
```
## Tops
To obtain the top type:
```js
api.tops.get(type) // => Promise<Array>
```
Possible top types:
* top
* friends
* relative
* creators
