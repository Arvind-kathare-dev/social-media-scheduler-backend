import pkg from "pg";
const { Pool } = pkg;

let pool;

const connectDB = async () => {
  try {
    // For Supabase/Vercel Postgres, use POSTGRES_URL if available
    let config;

    if (process.env.POSTGRES_URL) {
      // Remove sslmode parameter from connection string to avoid conflicts
      const connectionString = process.env.POSTGRES_URL.replace(/[?&]sslmode=\w+/, '');

      config = {
        connectionString: connectionString,
        ssl: {
          rejectUnauthorized: false,
        },
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      };
    } else {
      // Local development configuration
      config = {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      };
    }

    console.log("Attempting to connect with config:", {
      ...config,
      password: config.password ? "***" : "none",
    });

    // Create a connection pool
    pool = new Pool(config);

    // Test the connection
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    console.log(`✅ Connected to PostgreSQL database at: ${result.rows[0].now}`);
    client.release();

    // Handle pool errors
    pool.on("error", (err) => {
      console.error("🔴 Unexpected error on idle client:", err.message);
    });

    pool.on("connect", () => {
      console.log("🟢 New client connected to the pool");
    });

    pool.on("remove", () => {
      console.log("⚠️ Client removed from the pool");
    });

    return pool;
  } catch (error) {
    console.error(`❌ Database connection failed: ${error.message}`);
    console.error("Full error:", error);
    throw error; // Re-throw to handle it in server startup
  }
};

// Get the pool instance
export const getPool = () => {
  if (!pool) {
    throw new Error("Database pool not initialized. Call connectDB first.");
  }
  return pool;
};

// Automatically disconnect from DB when app closes
process.on("SIGINT", async () => {
  if (pool) {
    await pool.end();
    console.log("🟡 PostgreSQL pool closed due to app termination");
  }
  process.exit(0);
});

export default connectDB;