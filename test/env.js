process.env.DB_HOST = "127.0.0.1";
process.env.DB_USERNAME = "root";
process.env.NODE_ENV = "test";
// process.env.LE_ENV = true;
if (process.env.TRAVIS_ENV === '1') {
  process.env.DB_PASSWORD = "";
} else if (process.env.LE_ENV) {
  process.env.DB_PASSWORD = "12345678";
} else {
  process.env.DB_PASSWORD = "tanduy899";
}
process.env.DB_NAME = "yocto_erp";
process.env.WEB_URL = "http://localhost:4201";
process.env.PORT = 4001;
process.env.ETHER_PRIVATE_KEY = '0xb7b49348157a97cfc5c4403a9b8b6a8f7b1203e123cd6e6fec59158c2503570d';
process.env.ETHER_SMART_CONTRACT = '0x688Ff2472c992F0849e765083F75E85564f86483';
process.env.ETHER_PUBLIC_KEY = '0xE8fb426AFeDC4cdC5239b8F59F6dE22513746Fc5';
