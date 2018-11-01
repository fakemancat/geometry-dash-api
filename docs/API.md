# Using the server API
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
Available method:</br>

For information on user ID:
```js
api.users.getById(accountID) // => object
```

For information on user nick:
```js
api.users.getByNick(accountID) // => object
```

To send requests to your friends in someone's ID:
```js
api.users.addFriendRequest(accountID, message) // => If successful: true
```
