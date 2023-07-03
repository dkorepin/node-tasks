import { User } from "../models/user/User";
import request from "supertest";
import fc from "fast-check";
import { TEST_DATA_RUNS, baseURL, getToken } from "../test.helper";
import { groupArbitrary } from "./group-service.test";
import { StatusCodes } from "http-status-codes";

const userArbitrary = fc.record<Partial<User>>({
  login: fc.string({ maxLength: 15, minLength: 4 }),
  password: fc.string({ maxLength: 10, minLength: 4 }),
  age: fc.integer({ max: 100, min: 10 }),
});

describe("/users", () => {
  fc.assert(
    fc.property(groupArbitrary, (testGroup) => {
      fc.assert(
        fc.property(userArbitrary, (newUser) => {

          const updatedUser: Partial<User> = {
            ...newUser,
            password: "123df",
            age: 19,
          };

          let userId = "";
          let groupId = "";
          let token = "";

          beforeAll(async () => {
            token = await getToken();

            const response = await request(baseURL).post("/group").send(testGroup).set("x-access-token", token);
            groupId = response.body.group?.id;
          });

          afterAll(async () => {
            await request(baseURL).delete(`/group/${groupId}`).set("x-access-token", token);
          });

          it("Create new user should working", async () => {
            const response = await request(baseURL).post("/users").send(newUser).set("x-access-token", token);
            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body.user?.id).not.toBe(undefined);
            userId = response.body.user?.id;
            expect(response.body.user?.groups).toBe(undefined);
          });
          it("Create new user should return error in partial user", async () => {
            const response = await request(baseURL)
              .post("/users")
              .send({ login: newUser.login })
              .set("x-access-token", token);
            expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
            expect(response.body.status).toBe("failed");
          });
          it("Create new user should protect unauthorized", async () => {
            const response = await request(baseURL).post("/users").send(newUser).set("x-access-token", "bad token");
            expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
          });
          it("Get by id should return value", async () => {
            const response = await request(baseURL).get(`/users/${userId}`).set("x-access-token", token);
            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body.user).toEqual(expect.objectContaining(newUser));
          });
          it("Get by id should return error without user", async () => {
            const response = await request(baseURL).get(`/users/unhandledId`).set("x-access-token", token);
            expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
          });
          it("Get by id should protect unauthorized", async () => {
            const response = await request(baseURL).get(`/users/${userId}`).set("x-access-token", "bad token");
            expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
          });
          it("Set group should protect unauthorized", async () => {
            const response = await request(baseURL)
              .post(`/users/addToGroup/${userId}`)
              .send({ id: groupId })
              .set("x-access-token", "bad token");
            expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
          });
          it("Set group should working", async () => {
            const response = await request(baseURL)
              .post(`/users/addToGroup/${userId}`)
              .send({ id: groupId })
              .set("x-access-token", token);
            expect(response.statusCode).toBe(StatusCodes.OK);
            const responseUser = await request(baseURL).get(`/users/${userId}`).set("x-access-token", token);
            expect(responseUser.body.user?.groups.length).toBe(1);
          });
          it("Get all should return StatusCodes.OK", async () => {
            const response = await request(baseURL).get("/users").set("x-access-token", token);
            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body.users).not.toBe(undefined);
          });
          it("Get all should return some count of users", async () => {
            const response = await request(baseURL).get("/users").set("x-access-token", token);
            expect(response.body.users.length >= 0).toBe(true);
          });
          it("Get all should return single user on the search", async () => {
            const response = await request(baseURL)
              .get(`/users?search=${newUser.login}&limit=1`)
              .set("x-access-token", token);
            expect(response.body.users.length === 1).toBe(true);
          });
          it("Get all should protect unauthorized", async () => {
            const response = await request(baseURL).get("/users").set("x-access-token", "bad token");
            expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
          });
          it("Update should update user", async () => {
            const response = await request(baseURL)
              .put(`/users/${userId}`)
              .send(updatedUser)
              .set("x-access-token", token);
            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body.user).toEqual(expect.objectContaining(updatedUser));
          });
          it("Update should protect unauthorized", async () => {
            const response = await request(baseURL)
              .put(`/users/${userId}`)
              .send(updatedUser)
              .set("x-access-token", "bad token");
            expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
          });
          it("Delete should protect unauthorized", async () => {
            const response = await request(baseURL).delete(`/users/${userId}`).set("x-access-token", "bad token");
            expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
          });
          it("Delete should working", async () => {
            const response = await request(baseURL).delete(`/users/${userId}`).set("x-access-token", token);
            expect(response.statusCode).toBe(StatusCodes.OK);
            const responseFind = await request(baseURL).get(`/users/${userId}`).set("x-access-token", token);
            expect(responseFind.statusCode).toBe(StatusCodes.BAD_REQUEST);
          });
        }),
        { numRuns: TEST_DATA_RUNS }
      );
    }),
    { numRuns: TEST_DATA_RUNS }
  );
});
