const FixedWindowLimiter =require('../helpers/fixedWindowLimiter');
const REQUEST_LIMIT = 10;
const WINDOW_MS=60_000;
const rateLimiter = new FixedWindowLimiter(REQUEST_LIMIT, WINDOW_MS);
module.exports = async function(req,res, next){

  //Get user ip
  const userIndentifer = req?.user?.id || req.ip;
  if(!userIndentifer){
    return res.status(401).json({
      msg:'Unauthorize'
    })
  }
  //Split bucket it different request, instead of merging many routes into one bucker
  const requestPath = `${req.method}:${req.baseUrl}:${req.path}`;
  const keyIndentifier= `${requestPath}:${userIndentifer}`;
  try {
    const { allowed, limit, remaining, resetMs } = await rateLimiter.allowRequest(keyIndentifier);
    //Clients can only pace themselves if they see these on success too
    res.setHeader('X-RateLimit-Limit', limit.toString());
    res.setHeader('X-RateLimit-Remaining', remaining.toString());
    if(!allowed) {
      //Round up: flooring tells the client to retry before the window closes
      const retryAfterSeconds = Math.max(1, Math.ceil(resetMs / 1000));
      res.setHeader('Retry-After', retryAfterSeconds.toString());
      return res.status(429).json({
        msg:'Too Many Request, try again later'
      })
    }
    next();
    
  } catch (error) {
    console.log('RateLimiter',error);
    next();
  }

}
