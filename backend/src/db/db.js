import pg from "pg";

const {Pool, Client} = pg;

const isWorker = typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers";

function createWorkerDb(env) {
  const connect = async () => {
    const client = new Client({connectionString: env.HYPERDRIVE?.connectionString ?? process.env.DATABASE_URL});
    await client.connect();
    client.release = () => client.end();
    return client;
  };

  return {
    connect,
    async query(text, params) {
      const client = await connect();
      try {
        return await client.query(text, params);
      } finally {
        await client.release();
      }
    },
    async end() {},
  };
}

function createLocalDb() {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    maxLifetimeSeconds: 60,
  });
}

const db = isWorker
  ? createWorkerDb((await import("cloudflare:workers")).env)
  : createLocalDb();

export default db;
