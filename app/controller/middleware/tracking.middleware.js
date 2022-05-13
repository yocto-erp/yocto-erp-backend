import { getIP, userAgent } from "../../util/request.util";

export const trackingMiddleware = (req, res, next) => {
  const ip = getIP(req);
  const userAgentStr = userAgent(req);
  req.tracking = { ip, userAgent: userAgentStr };
  next();
};
