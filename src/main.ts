import { MySqlInstance } from "@libraries/Database";

const mysql = MySqlInstance.getInstance();

await mysql.start();