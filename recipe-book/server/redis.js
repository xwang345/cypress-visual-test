import {redis} from "redis";
import chalk from 'chalk';

const client = redis.createClient({
  host: "127.0.0.1",
  port: 6379,
  password: "password",
});

console.log(chalk.blue("Connecting to Redis..."));

client.on("connect", () => {
  console.log(chalk.blue("Redis client connected"));
});

client.on("ready", () => {
  console.log(chalk.blue("Redis client ready to use"));
});

client.on("error", (err) => {
  console.log(chalk.blue("Something went wrong " + err));
});

client.on("end", () => {
  console.log(chalk.blue("Redis client disconnected"));
});

// process.on("SIGINT", () => {
//   client.quit();
// });

// module.exports = client;

// client.set("key", "value", redis.print);
// client.get("key", redis.print);