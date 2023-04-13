import { User } from "../models/user/User";
import request from "supertest";
import { baseURL, getToken } from "../test.helper";
import { Group } from "../models/group";

describe("/users", () => {
  const testGroup: Partial<Group> = {
    name: "Test group name12",
    permissions: ["READ"],
  };
  const newUser: Partial<User> = {
    login: "AutotestUser12",
    password: "sa;fj@",
    age: 29,
  };
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
    const findUserResponse = await request(baseURL)
      .get(`/users?search=${newUser.login}&limit=1`)
      .set("x-access-token", token);
    if (findUserResponse.body.users.length > 0) {
      const response = await request(baseURL)
        .delete(`/users/${findUserResponse.body.users[0]?.id}`)
        .set("x-access-token", token);
      if (response.statusCode !== 200) throw new Error("can't remove user");
    }
    const response = await request(baseURL).post("/group").send(testGroup).set("x-access-token", token);
    groupId = response.body.group?.id;
  });

  afterAll(async () => {
    await request(baseURL).delete(`/group/${groupId}`).set("x-access-token", token);
  });

  it("Create new user should working", async () => {
    const response = await request(baseURL).post("/users").send(newUser).set("x-access-token", token);
    expect(response.statusCode).toBe(200);
    expect(response.body.user?.id).not.toBe(undefined);
    userId = response.body.user?.id;
    expect(response.body.user?.groups).toBe(undefined);
  });
  it("Create new user should return error in partial user", async () => {
    const response = await request(baseURL).post("/users").send({ login: newUser.login }).set("x-access-token", token);
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("failed");
  });
  it("Create new user should protect unauthorized", async () => {
    const response = await request(baseURL).post("/users").send(newUser).set("x-access-token", "bad token");
    expect(response.statusCode).toBe(403);
  });
  it("Get by id should return value", async () => {
    const response = await request(baseURL).get(`/users/${userId}`).set("x-access-token", token);
    expect(response.statusCode).toBe(200);
    expect(response.body.user).toEqual(expect.objectContaining(newUser));
  });
  it("Get by id should return error without user", async () => {
    const response = await request(baseURL).get(`/users/unhandledId`).set("x-access-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Get by id should protect unauthorized", async () => {
    const response = await request(baseURL).get(`/users/${userId}`).set("x-access-token", "bad token");
    expect(response.statusCode).toBe(403);
  });
  it("Set group should protect unauthorized", async () => {
    const response = await request(baseURL)
      .post(`/users/addToGroup/${userId}`)
      .send({ id: groupId })
      .set("x-access-token", "bad token");
    expect(response.statusCode).toBe(403);
  });
  it("Set group should working", async () => {
    const response = await request(baseURL)
      .post(`/users/addToGroup/${userId}`)
      .send({ id: groupId })
      .set("x-access-token", token);
    expect(response.statusCode).toBe(200);
    const responseUser = await request(baseURL).get(`/users/${userId}`).set("x-access-token", token);
    expect(responseUser.body.user?.groups.length).toBe(1);
  });
  it("Get all should return 200", async () => {
    const response = await request(baseURL).get("/users").set("x-access-token", token);
    expect(response.statusCode).toBe(200);
    expect(response.body.users).not.toBe(undefined);
  });
  it("Get all should return some count of users", async () => {
    const response = await request(baseURL).get("/users").set("x-access-token", token);
    expect(response.body.users.length >= 0).toBe(true);
  });
  it("Get all should return single user on the search", async () => {
    const response = await request(baseURL).get(`/users?search=${newUser.login}&limit=1`).set("x-access-token", token);
    expect(response.body.users.length === 1).toBe(true);
  });
  it("Get all should protect unauthorized", async () => {
    const response = await request(baseURL).get("/users").set("x-access-token", "bad token");
    expect(response.statusCode).toBe(403);
  });
  it("Update should update user", async () => {
    const response = await request(baseURL).put(`/users/${userId}`).send(updatedUser).set("x-access-token", token);
    expect(response.statusCode).toBe(200);
    expect(response.body.user).toEqual(expect.objectContaining(updatedUser));
  });
  it("Update should protect unauthorized", async () => {
    const response = await request(baseURL)
      .put(`/users/${userId}`)
      .send(updatedUser)
      .set("x-access-token", "bad token");
    expect(response.statusCode).toBe(403);
  });
  it("Delete should protect unauthorized", async () => {
    const response = await request(baseURL).delete(`/users/${userId}`).set("x-access-token", "bad token");
    expect(response.statusCode).toBe(403);
  });
  it("Delete should working", async () => {
    const response = await request(baseURL).delete(`/users/${userId}`).set("x-access-token", token);
    expect(response.statusCode).toBe(200);
    const responseFind = await request(baseURL).get(`/users/${userId}`).set("x-access-token", token);
    expect(responseFind.statusCode).toBe(400);
  });
});
