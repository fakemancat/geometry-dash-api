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
  console.log(user); // => Object
})()
```
or
```js
api.login().then(async(_user) => {
  const user = await api.users.getById({
    accountID: 71
  });
  console.log(user); // => Object
  console.log(_user); // => Object { accountID: Number, userID: Number }
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
const user = await api.users.getById(ID);
console.log(user); // => object
```
|Param |Type|Description|
|-|-|-|
|ID|Number|user account ID|
# 
For information on user nick:
```js
const user = await api.users.getByNick(nick);
console.log(user); // => object
```
|Param|Type|Description|
|-|-|-|
|nick|String|The nickname of the user|
### Friends
To send requests to your friends in someone's ID:
```js
await api.friends.addRequest({ params }); // => If successful: true
```
|Param|Type|Description|
|-|-|-|
|toAccountID|Number|Player's ID|
|message|String|Message when adding|
### Levels
For information of level on ID:
```js
const level = await api.levels.getById({ params });
console.log(level); // => object
```
|Param|Type|Description|
|-|-|-|
|levelID|Number|Level ID|
|levelString|Boolean|Return level String or not|
### Tops
To obtain the top type:
```js
const users = await api.tops.get({ params });
console.log(users); // => array of objects
```
|Param|Type|Description|
|-|-|-|
|type|String|Top type|
|count|Number|Count of users|

Possible top types:
* top
* friends
* relative
* creators
