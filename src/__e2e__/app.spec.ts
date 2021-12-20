import { hash } from "bcrypt";
import faker from "faker";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { User } from "../modules/accounts/infra/typeorm/entities/User";
import { app } from "../shared/infra/http/app";
import createConnection from "../shared/infra/typeorm";

let connection: Connection;
const adminUser = {} as User;
let adminToken: string;
const user = {} as User;

describe("App", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    adminUser.password = "admin";
    adminUser.email = "admin@rentalx.com";
    adminToken = "";
    const id = uuidv4();
    const password = await hash("admin", 8);

    await connection.query(
      `
    INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
    values('${id}', 'admin', 'admin@rentalx.com', '${password}', true, 'now()', 'XXXXXXX')
    `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("SESSIONS: should be able to log in with a admin user", async () => {
    const response = await request(app)
      .post("/sessions")
      .send({ email: adminUser.email, password: adminUser.password });

    adminToken = response.body.token;

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        user: expect.objectContaining({
          name: expect.any(String),
          email: expect.any(String),
        }),
      })
    );
  });

  it("CREATE CATEGORY: should be able to create a category", async () => {
    const category = {
      name: faker.vehicle.model(),
      description: faker.vehicle.vehicle(),
    };

    const response = await request(app)
      .post("/categories")
      .send(category)
      .set({ authorization: `Bearer ${adminToken}` });

    console.log(response.body);

    expect(response.status).toBe(201);
  });

  it("CREATE CATEGORY: should not be able to create a category with the same name", async () => {
    const category = {
      name: faker.vehicle.model(),
      description: faker.vehicle.vehicle(),
    };

    await request(app)
      .post("/categories")
      .send(category)
      .set({ authorization: `Bearer ${adminToken}` });

    const response = await request(app)
      .post("/categories")
      .send(category)
      .set({ authorization: `Bearer ${adminToken}` });

    expect(response.status).toBe(400);
  });

  it("LIST CATEGORY: should be able to list all categories", async () => {
    const response = await request(app).get("/categories");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          created_at: expect.any(String),
        })
      )
    );
  });
});
