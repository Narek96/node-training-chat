const BaseRedisService = require('./BaseRedisService');
const redis = require('redis');

class UserService extends BaseRedisService {

  addUser(data) {
    this.client.set(data.nickName, data.nickName, redis.print);
    return this.getUser(data.nickName)
  }

  async getUser(nickName) {
    return await this.promise(nickName);
  }

  removeUser(nickName) {
    if (this.hasUser(nickName)) {
      this.client.del(nickName)
    }
  }

  hasUser(nickName) {
    return this.getUser(nickName)
  }
}


module.exports = UserService;
