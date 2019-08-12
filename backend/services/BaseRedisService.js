const redis = require("redis");

const client = redis.createClient();
const { promisify } = require('util');

const getAsync = promisify(client.get).bind(client);

class BaseRedisService {

  constructor() {
    this.promise = getAsync;
    this.client = client;
  }
}

module.exports = BaseRedisService;
