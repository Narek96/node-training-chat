const BaseRedisService = require('./BaseRedisService');
const redis = require('redis');
const UserService = require('./UserService');

class MessageService extends BaseRedisService {

  async addUserMessage(data) {
    const userService = new UserService();
    const user = await userService.getUser(data.name);
    if (!!user) {
      console.log(56);
      this.client.rpush(`messages`, JSON.stringify(data), redis.print);
    }

  }

  getMessages() {
    return new Promise((resolve, reject) => {
      this.client.lrange('messages', 0, -1, function (err, replies) {
         if (err) {
           reject(err)
         }
        resolve(replies);
      });
    });
  }
}

module.exports = MessageService;
