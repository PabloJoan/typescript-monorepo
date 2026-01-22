import { Client } from "@elastic/elasticsearch";
import dotenv from "dotenv";

dotenv.config();

if (
  !process.env.ELASTICSEARCH_USERNAME ||
  !process.env.ELASTICSEARCH_PASSWORD
) {
  throw new Error("ELASTICSEARCH_USERNAME or ELASTICSEARCH_PASSWORD not found");
}

export const esClient = new Client({
  node: process.env.ELASTICSEARCH_NODE || "http://localhost:9200",
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME,
    password: process.env.ELASTICSEARCH_PASSWORD,
  },
});
