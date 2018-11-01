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
