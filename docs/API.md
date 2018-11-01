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
## API methods
### Users
For information on user ID:
```js
api.users.getById({ params }); // => Promise<Object>
```
|Param |Type|Description|
|--------|-------|
|accountID|Number|user account ID|
# 
For information on user nick:
```js
api.users.getByNick({ params }); // => Promise<Object>
```
|Param|Type|Description|
|--------|-------|
|nick|String|The nickname of the user|
## Friends
To send requests to your friends in someone's ID:
```js
api.friends.addRequest({ params }); // => If successful: Promise<Boolean>
```
|Param|Type|Description|
|--------|-------|
|accountID|Number|Add player ID|
|message|String|Message when adding|
## Levels
For information of level on ID:
```js
api.levels.getById({ params }); // => Promise<Object>
```
|Param|Type|Description|
|--------|-------|
|levelID|Number|Level ID|
|levelString|Boolean|Return level String or not|
## Tops
To obtain the top type:
```js
api.tops.get({ params }); // => Promise<Array>
```
|Param|Type|Description|
|--------|-------|
|type|String|Top type|
|count|Number|Count of users|
Possible top types:
* top
* friends
* relative
* creators
