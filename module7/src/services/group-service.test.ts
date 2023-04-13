import request from "supertest";
import { baseURL, getToken } from "../test.helper";
import { Group } from "../models/group";

describe("/group", () => {
  const testGroup: Partial<Group> = {
    name: "Test group name123",
    permissions: ["READ"],
  };
  const updatedGroup: Partial<Group> = {
    ...testGroup,
    permissions: ["READ", "WRITE"],
  };

  let groupId = "";
  let token = "";

  beforeAll(async () => {
    token = await getToken();
  });

  afterAll(async () => {
    await request(baseURL).delete(`/group/${groupId}`).set("x-access-token", token);
  });

  it("Create new group should working", async () => {
    const response = await request(baseURL).post("/group").send(testGroup).set("x-access-token", token);
    expect(response.statusCode).toBe(200);
    expect(response.body.group?.id).not.toBe(undefined);
    groupId = response.body.group?.id;
    expect(response.body.group?.groups).toBe(undefined);
  });
  it("Create new group should return error in partial group", async () => {
    const response = await request(baseURL).post("/group").send({ login: testGroup.name }).set("x-access-token", token);
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("failed");
  });
  it("Create new group should protect unauthorized", async () => {
    const response = await request(baseURL).post("/group").send(testGroup).set("x-access-token", "bad token");
    expect(response.statusCode).toBe(403);
  });
  it("Get by id should return value", async () => {
    const response = await request(baseURL).get(`/group/${groupId}`).set("x-access-token", token);
    expect(response.statusCode).toBe(200);
    expect(response.body.group).toEqual(expect.objectContaining(testGroup));
  });
  it("Get by id should return error without group", async () => {
    const response = await request(baseURL).get(`/group/unhandledId`).set("x-access-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Get by id should protect unauthorized", async () => {
    const response = await request(baseURL).get(`/group/${groupId}`).set("x-access-token", "bad token");
    expect(response.statusCode).toBe(403);
  });
  it("Get all should return 200", async () => {
    const response = await request(baseURL).get("/group").set("x-access-token", token);
    expect(response.statusCode).toBe(200);
    expect(response.body.group).not.toBe(undefined);
  });
  it("Get all should return some count of groups", async () => {
    const response = await request(baseURL).get("/group").set("x-access-token", token);
    expect(response.body.group.length >= 0).toBe(true);
  });
  it("Get all should protect unauthorized", async () => {
    const response = await request(baseURL).get("/group").set("x-access-token", "bad token");
    expect(response.statusCode).toBe(403);
  });
  it("Update should update group", async () => {
    const response = await request(baseURL).put(`/group/${groupId}`).send(updatedGroup).set("x-access-token", token);
    expect(response.statusCode).toBe(200);
    expect(response.body.group).toEqual(expect.objectContaining(updatedGroup));
  });
  it("Update should protect unauthorized", async () => {
    const response = await request(baseURL)
      .put(`/group/${groupId}`)
      .send(updatedGroup)
      .set("x-access-token", "bad token");
    expect(response.statusCode).toBe(403);
  });
  it("Delete should protect unauthorized", async () => {
    const response = await request(baseURL).delete(`/group/${groupId}`).set("x-access-token", "bad token");
    expect(response.statusCode).toBe(403);
  });
  it("Delete should working", async () => {
    const response = await request(baseURL).delete(`/group/${groupId}`).set("x-access-token", token);
    expect(response.statusCode).toBe(200);
    const responseFind = await request(baseURL).get(`/group/${groupId}`).set("x-access-token", token);
    expect(responseFind.statusCode).toBe(400);
  });
});
