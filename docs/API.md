# Using the server API
Get API methods:
```js
const { api } = client;
```
To start before using the API you need to log in:
```js
(async() => {
  await client.login();
  
  const user = await api.users.getById(71);
  
  console.log(user); // => Object
})();
```
or
```js
client.login().then(async(_user) => {
  const user = await api.users.getById(71);
  
  console.log(user); // => Object
  console.log(_user); // => Object { accountID: Number, userID: Number }
});
```
Any asynchronous function is required.</br>
For each asynchronous function, you need to login:
```js
(async() => { // 1
  await client.login();
  
  /* Any action with the API */
})();

(async() => { // 2
  await client.login();
  
  /* Any action with the API */
})();

// ...
```
### Why you need a login
if you don't sign in, you won't have an accountID defined. Which is why you won't be able to use most of the methods
```js
const GDClient = require('geometry-dash-api');

const client = new GDClient({
  server: 'http://fakeman-cat.tk:1234/server',
  userName: 'Fakeman Cat',
  password: 'password'
});

console.log(client.options); // => Object

/*  {
 *    server: 'http://fakeman-cat.tk:1234/server',
 *    userName: 'Fakeman Cat',
 *    password: 'password',
 *    gjp: 'generatedGJP'
 *  }
 */

client.login().then(() => {
  console.log(client.options); // => Object
  
 /*  {
  *    server: 'http://fakeman-cat.tk:1234/server',
  *    userName: 'Fakeman Cat',
  *    password: 'password',
  *    gjp: 'generatedGJP',
  *    accountID: 71
  *  }
  */ 
});
```
## API methods
### Account
To add a post to your profile:
```js
const result = await api.account.addPost(message);
console.log(result); // => null OR commentID
```
|Param |Type|Description|
|-|-|-|
|message|String|Text to send|
#
To remove a post from your profile:
```js
const result = await api.account.deletePost(commentID);
console.log(result); // => null OR true
```
|Param |Type|Description|
|-|-|-|
|commentID|String|Text to send|
#
To update your profile settings:
```js
const result = await api.account.updateSettings({ params });
console.log(result); // => null OR true
```
|Param |Type|Description|
|-|-|-|
|messagesFrom|String|Allow message from|
|friendReqsFrom|String|Allow friends requests from|
|commentHistoryTo|String|Show comment history to|
|youtube|String|YouTube link|
|twitter|String|Twitter link|
|twitch|String|Twitch link|

Possible messagesFrom types:
* all
* friends
* none

Possible friendReqsFrom types:
* all
* none

Possible commentHistoryTo types:
* all
* friends
* me
### Users
For information on user ID:
```js
const user = await api.users.getById(ID);
console.log(user); // => null OR Object
```
|Param |Type|Description|
|-|-|-|
|ID|Number|user account ID|
# 
For information on user nick:
```js
const user = await api.users.getByNick(nick);
console.log(user); // => null OR Object
```
|Param|Type|Description|
|-|-|-|
|nick|String|The nickname of the user|
#
To find players:
```js
const users = await api.users.find({ params });
console.log(users); // => null OR Object
```
|Param|Type|Description|
|-|-|-|
|query|String|Search query|
|page|Number|The page you want to get|

The "Page" parameter can be omitted, then it will be 0
### Friends
To send requests to your friends in someone's ID:
```js
await api.friends.sendRequest({ params }); // => If successful: true
```
|Param|Type|Description|
|-|-|-|
|toAccountID|Number|Player's ID|
|message|String|Message when adding|
#
To delete a submitted friend request:
```js
const result = await api.friends.deleteSentRequest(targetAccountID);
console.log(result); // => null OR true
```
|Param|Type|Description|
|-|-|-|
|targetAccountID|Number|accountID of the person to whom the application was sent|
#
To delete the received friend request:
```js
const result = await api.friends.deleteRequest(targetAccountID);
console.log(result); // => null OR true
```
|Param|Type|Description|
|-|-|-|
|targetAccountID|Number|accountID of the person from whom the application came|
#
To receive applications came to friends:
```js
const result = api.friends.getRequests(page);
console.log(result); // => null OR Object
```
|Param|Type|Description|
|-|-|-|
|page|Number|The page you want to get|

The "Page" parameter can be omitted, then it will be 0
#
To receive applications sent to friends:
```js
const result = api.friends.getSentRequests(page);
console.log(result); // => null OR Object
```
|Param|Type|Description|
|-|-|-|
|page|Number|The page you want to get|

The "Page" parameter can be omitted, then it will be 0
#
To accept the application as a friend:
```js
const result = await api.friends.acceptRequest({ params });
console.log(result); // => null OR true
```
|Param|Type|Description|
|-|-|-|
|targetAccountID|Number|accountID of the person who sent the application|
|requestID|Number|ID of the application to friends|

These parameters can be obtained from the methods: ```getRequests``` and ```getSentRequests``` methods
### Levels
For information of level on ID:
```js
const level = await api.levels.getById({ params });
console.log(level); // => null OR Object
```
|Param|Type|Description|
|-|-|-|
|levelID|Number|Level ID|
|levelString|Boolean|Return level String or not|
#
For getting weekly or daily levels:
```js
const daily = await api.levels.getDaily();
const weekly = await api.levels.getWeekly();

console.log(daily); // => Object
console.log(weekly); // => Object
```
### Tops
To obtain the top type:
```js
const users = await api.tops.get({ params });
console.log(users); // => Array of objects
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
