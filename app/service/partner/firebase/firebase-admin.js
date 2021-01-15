const admin = require("firebase-admin");

// eslint-disable-next-line import/no-dynamic-require
const serviceAccount = require(process.env.YOCTO_ERP_FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://yocto-erp.firebaseio.com"
});

export default admin;
