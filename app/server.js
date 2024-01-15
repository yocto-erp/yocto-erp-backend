import http from "http";
import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import { appLog } from "./config/winston";
import appConf from "./config/application";

import { FormError, HttpError, isSystemError } from "./config/error";
import { loadConfigure, SYSTEM_CONFIG } from "./config/system";
import { initWebController } from "./controller/web";
import { initMobileController } from "./controller/mobile";

import service from "./service/passport";
import { initCronTasks } from "./cron";
import { initSwagger } from "./swagger";

service(passport);
export const app = express();

// app.use(morgan("combined", { stream: httpStream }));
app.use(passport.initialize(null));
app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ extended: false }));

/* eslint-enable no-unused-vars */
app.get("/", (req, res) => res.send({ message: "Welcome to the default API route" }));

/* MOBILE */
initMobileController(app);

/* WEB */
initWebController(app);

initSwagger(app);

app.use((err, req, res, next) => {
  appLog.error(`message - ${err.message}, stack trace - ${err.stack}`);
  next(err);
});

/**
 * Not remove next
 */
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err instanceof FormError) {
    res.status(err.code)
      .json(err.errors);
  } else if (err instanceof HttpError) {
    res.status(err.code)
      .json({ error: err.message });
  } else if (!isSystemError(err)) {
    res.statusMessage = err.message;
    res.status(500)
      .json({ error: err.message });
  }
});

// setup express application
const server = http.createServer(app);

// initSocket(server);

const PORT = process.env.PORT || appConf.port;
server.listen(PORT, appConf.hostname, async () => {
  await loadConfigure().then(systemConfigure => {
    appLog.info(`System Configure Load: ${JSON.stringify(systemConfigure)}`);
    // appLog.info(`Env ${JSON.stringify(process.env)}`);
    app.use("/upload", express.static(SYSTEM_CONFIG.PUBLIC_FOLDER));
    app.use("/thumbnail", express.static(`${SYSTEM_CONFIG.PUBLIC_FOLDER}/thumbnail`));
  });
  initCronTasks();
  appLog.info(`Server running at http://${appConf.hostname}:${PORT}/`);
});
