# Using the server API
Get API methods:
```js
const { api } = Server;
```
To start before using the API you need to log in:
```js
(async() => {
  await api.login();
  
  const user = await api.users.getById({
    accountID: 71
  });
  console.log(user); // => object
})()
```
or
```js
api.login().then(async() => {
  const user = await api.users.getById({
    accountID: 71
  });
  console.log(user); // => object
});
```
Any asynchronous function is required.</br>
For each asynchronous function, you need to login:
```js
(async() => { // 1
  await api.login();
  
  /* Any action with the API */
})();

(async() => { // 2
  await api.login();
  
  /* Any action with the API */
})();

// ...
```
# API methods
## Users
For information on user ID:
```js
api.users.getById({ params }); // => Promise<Object>
```
|Param    |Type  |Description    |
|---------|------|---------------|
|accountID|Number|user account ID|
#
For information on user nick:
```js
api.users.getByNick({ params }); // => Promise<Object>
```
## Friends
To send requests to your friends in someone's ID:
```js
api.friends.addRequest({ params }); // => If successful: Promise<Boolean>
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
api.tops.get({ params }) // => Promise<Array>
```
Possible params:
```js
type // String
count // Number
```
Possible top types:
* top
* friends
* relative
* creators
