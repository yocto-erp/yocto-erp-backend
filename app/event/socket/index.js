import {Server} from "socket.io";
import {passportJWT} from "../../controller/middleware/permission";
import {HTTP_ERROR, HttpError} from "../../config/error";

let io;

const options = {
  serveClient: true,
  path: "/api/socket/",
  cors: {
    origin: ["https://app.yoctoerp.com", "http://localhost:3000"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
}

export const socketMiddlewareWrap = middleware => (socket, next) => middleware(socket.request, {}, next);

export function initSocket(httpServer) {
  console.info('Init socket');
  io = new Server(httpServer, options);
  io.use(socketMiddlewareWrap(passportJWT()))
    .use(socketMiddlewareWrap((req, res, next) => {
      if (req.isAuthenticated()) {
        next();
      } else {
        throw new HttpError(HTTP_ERROR.NOT_AUTHENTICATE, 'Not Authenticated', null);
      }
    }))
  // io.use(socketMiddlewareWrap(isAuthenticated));
  io.on("connection", socket => {

    const {companyId} = socket.request.user;
    console.log('Connected: ', companyId);
    socket.join(`ROOM_${companyId}`);
    io.to(`ROOM_${companyId}`).emit('WELCOME', `Hello Company ${companyId}, i'm ${socket.request.user.email}`);
  });
  io.on('connect', (socket) => {
    console.log(`new connection ${socket.id}`);
  });
}
