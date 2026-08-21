class FixedWindowLimiter{
  #window;
  #limit;
  #redisClient;
  constructor(limit, window){
    this.#limit = limit,
    this.#window = window
    this.#redisClient = require('../config/redis');
  }

  async allowRequest(identityKey){
    //1.Check the key exist for the specific keyPath + iden
    const key = `rateFixed:${identityKey}`;
    const currentCounter = await this.#redisClient.get(key);
    if(currentCounter === null){
      //2.If id does not exist, create key with the new expirty and increase counter
      await this.#redisClient.set(key,1,{
        px:this.#window
      });
      return true
    }
    //4. If it exceeds return false
    if(this.#limit <= currentCounter) return false

    //5. Increment counter and return true
    await this.#redisClient.incr(key)
    return true;
  }
  async getTtl(identityKey){
    const key = `rateFixed:${identityKey}`
    return await this.#redisClient.ttl(key);

  }
}
module.exports = FixedWindowLimiter;