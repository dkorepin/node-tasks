import { Dialect } from "sequelize";

export default {
  HOST: "localhost",
  USER: "postgres",
  PASSWORD: "0000",
  DB: "nodejs-testbase",
  dialect: "postgres" as Dialect,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

// export default {
//   HOST: "dumbo.db.elephantsql.com",
//   USER: "rtgzmuas",
//   PASSWORD: "Np_vllL24oc4VpNmW_-hnOISdeS5kf1w",
//   DB: "rtgzmuas",
//   dialect: "postgres" as Dialect,
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000,
//   },
// };