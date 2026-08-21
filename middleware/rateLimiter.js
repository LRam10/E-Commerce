const FixedWindowLimiter =require('../helpers/fixedWindowLimiter');
const REQUEST_LIMIT = 2;
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
  const requestPath = `${req.method}:${req.path}`;
  const keyIndentifier= `${requestPath}:${userIndentifer}`;
  try {
    const isAllowedRequest = await rateLimiter.allowRequest(keyIndentifier)
    if(!isAllowedRequest) {
      const remainingTtl = await rateLimiter.getTtl( keyIndentifier);
      console.log(remainingTtl)
      //Set proper headers
      if(remainingTtl > 0) res.setHeader('Retry-After', remainingTtl.toString());
      res.setHeader('X-RateLimit-Limit', REQUEST_LIMIT.toString());
      res.setHeader('X-RateLimit-Remaining', '0');
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