import categorySeeder from "./category.js"
import mongoConnect from "../mongo/mongoConnecter.js"
async function seeder(){
  await mongoConnect()
  console.log("Start seeder category");
  await categorySeeder()
  console.log("seeder category end");
  process.exit(0)
}
seeder()