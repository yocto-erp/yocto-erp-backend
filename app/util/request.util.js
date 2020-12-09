export function getIP(req) {
  return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);
}

export function userAgent(req) {
  return req.headers['user-agent'];
}


export function getOrigin(req) {
  return req.get('origin');
}
