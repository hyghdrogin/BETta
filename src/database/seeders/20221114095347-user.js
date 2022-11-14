import { UUIDV4 } from "sequelize";

const bcrypt = require("bcrypt");
/** @type {import('sequelize-cli').Migration} */
require("dotenv").config();

const password = process.env.SEED_PASSWORD;
const hash = bcrypt.hashSync(password, 10);

export async function up(queryInterface, Sequelize) {
  /**
   * Add seed commands here.
   *
   * Example:
   * await queryInterface.bulkInsert('People', [{
   *   name: 'John Doe',
   *   isBetaMember: false
   * }], {});
  */
  return queryInterface.bulkInsert("Users", [
    {
      id: "e1bc7da3-61fe-4ece-bbd7-7bd1a5b9dcce",
      firstName: "Emmanuel",
      lastName: "Omopariola",
      email: "hyghdrogin@betta.com",
      phone: "+2349072668695",
      username: "hyghdrogin",
      password: hash,
      dob: "10/11/2022",
      location: "Lagos, Nigeria",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "c03e1a6b-58d1-4f05-9931-f8449ed62bce",
      firstName: "BETta",
      lastName: "Admin",
      email: "admin@betta.com",
      phone: "+2341-BETta",
      username: "admin",
      password: hash,
      dob: "10/11/2022",
      location: "Lagos, Nigeria",
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ]);
}
export async function down(queryInterface, Sequelize) {
  /**
   * Add commands to revert seed here.
   *
   * Example:
   * await queryInterface.bulkDelete('People', null, {});
   */
}
