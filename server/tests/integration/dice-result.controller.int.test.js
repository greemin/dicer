const request = require("supertest");
const app = require("../../app");

const newDiceResult = require("../mock-data/new-dice-result.json");
const missingFields = require("../mock-data/missing-fields.json");

const endpointUrl = "/dice-results/";

test("POST " + endpointUrl, async () => {
  const response = await request(app).post(endpointUrl).send(newDiceResult);
  expect(response.statusCode).toBe(201);
  expect(response.body.rolls).toStrictEqual(newDiceResult.rolls);
  expect(response.body.modifier).toStrictEqual(newDiceResult.modifier);
  expect(response.body.sum).toStrictEqual(newDiceResult.sum);
});

test("POST " + endpointUrl + " with missing fields", async () => {
  const response = await request(app).post(endpointUrl).send(missingFields);
  expect(response.statusCode).toBe(400);
});

test("GET " + endpointUrl, async () => {
  const response = await request(app).get(endpointUrl);
  expect(response.statusCode).toBe(200);
  expect(Array.isArray(response.body)).toBeTruthy();
  expect(response.body[0]).toStrictEqual(newDiceResult);
});

test("DELETE " + endpointUrl, async () => {
  const response = await request(app).delete(endpointUrl);
  expect(response.statusCode).toBe(204);
  expect(
    !response.body || Object.keys(response.body).length === 0
  ).toBeTruthy();

  const checkResponse = await request(app).get(endpointUrl);
  expect(checkResponse.statusCode).toBe(200);
  expect(checkResponse.body.length).toBe(0);
});
