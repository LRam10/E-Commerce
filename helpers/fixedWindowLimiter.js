const redisClient = require('../config/redis');

// Increment the counter and read its TTL in a single atomic Redis operation.
const INCREMENT_WINDOW = `
local count = redis.call('INCR', KEYS[1])
local ttl = redis.call('PTTL', KEYS[1])
if ttl < 0 then
  redis.call('PEXPIRE', KEYS[1], ARGV[1])
  ttl = tonumber(ARGV[1])
end
return { count, ttl }
`;
class FixedWindowLimiter {
  #window;
  #limit;
  #redisClient;

  constructor(limit, window) {
    this.#limit = limit;
    this.#window = window;
    this.#redisClient = redisClient;
  }

  /**
   * Records a request against `identityKey` and reports whether it is allowed.
   * @returns {Promise<{allowed: boolean, limit: number, remaining: number, resetMs: number}>}
   */
  async allowRequest(identityKey) {
    const key = `rateFixed:${identityKey}`;
    const [count, resetMs] = await this.#redisClient.eval(
      INCREMENT_WINDOW,
      [key],
      [this.#window]
    );

    return {
      allowed: count <= this.#limit,
      limit: this.#limit,
      remaining: Math.max(0, this.#limit - count),
      resetMs
    };
  }
}

module.exports = FixedWindowLimiter;