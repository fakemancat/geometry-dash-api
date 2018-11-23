# Using the server event handler:
```js
client.updates.on(event, callback, invterval);
```
You need to sign in to your account before you can use the listener:
```js
(async() => {
  await client.login();
  
  client.updates.on('lastNewRequest', (context) => {
    console.log(context); // => Object
  });
})();
```
or
```js
client.login().then(() => {
  client.updates.on('lastNewRequest', (context) => {
    console.log(context); // => Object
  });
});
```
or
```js
client.login();

client.updates.on('lastNewRequest', (context) => {
  console.log(context); // => Object
});
```
Since Geometry Dash has no callback, the listener is based on setInterval()</br>
By default, the interval requests an event from the server every second.</br>
If you want to increase the interval from one second, you can do so:
```js
client.updates.on('lastNewRequest', (context) => {
  console.log(context); // => Object
}, 1337);
```
**Less than one second will not work**
#
Possible events:
* lastNewRequest - Last incoming friend request
* lastSentRequest - Last outgoing friend request
#
Updates and API can be used in a pair:
```js
client.login().then(() => {

  client.updates.on('lastNewRequest', async(context) => {
    const { accountID } = context;
    
    const user = await client.api.users.getById(accountID);
    console.log(user); // => Object
  }, 2000);
  
});
```
#
In the future I will do more
