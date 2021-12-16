import { Connection, createConnection, getConnectionOptions } from "typeorm";

// interface IOptions {
//   host: string;
// }

// getConnectionOptions().then((options) => {
//   const newOptions = options as IOptions;
//   newOptions.host = "database"; // Essa opção deverá ser EXATAMENTE o nome dado ao service do banco de dados
//   createConnection({
//     ...options,
//   });
// });

export default async (host = process.env.DB_HOST): Promise<Connection> => {
  const defaultoptions = await getConnectionOptions();

  console.log("connection created");

  return createConnection(Object.assign(defaultoptions, { host }));
};
