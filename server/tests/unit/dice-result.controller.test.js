const httpMocks = require("node-mocks-http");
const DiceResultController = require("../../controllers/dice-result.controller");
var DiceResultModel = require("../../model/dice-result.model");

const newDiceResult = require("../mock-data/new-dice-result.json");
const missingFields = require("../mock-data/missing-fields.json");
const existingDiceResults = require("../mock-data/existing-dice-results.json");

jest.mock("../../model/dice-result.model");

var req, res, next;
describe("DiceResultController.createDiceResult", () => {
  beforeEach(() => {
    req = httpMocks.createRequest();
    req.body = newDiceResult;
    res = httpMocks.createResponse();
    res.statusCode = "placeholder"; // default status code is 200 and results in false positives
    next = jest.fn();
  });

  it("should have a function createDiceResult", () => {
    expect(typeof DiceResultController.createDiceResult).toBe("function");
  });

  it("should return 201 on succesfull create", async () => {
    await DiceResultController.createDiceResult(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should send a json body of created dice result", async () => {
    DiceResultModel.create.mockReturnValue(newDiceResult);
    await DiceResultController.createDiceResult(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newDiceResult);
  });

  it("should throw a 400 on missing fields", async () => {
    req.body = missingFields;
    await DiceResultController.createDiceResult(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(next).toBeCalledWith({ message: "Missing fields" });
  });

  it("should throw a 500 on internal server error", async () => {
    const errorMessage = { message: "create error!" };
    const rejectedPromise = Promise.reject(errorMessage);
    DiceResultModel.create.mockReturnValue(rejectedPromise);
    await DiceResultController.createDiceResult(req, res, next);
    expect(res.statusCode).toBe(500);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe("DiceResultController.getDiceResults", () => {
  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    res.statusCode = "placeholder"; // default status code is 200 and results in false positives
    next = jest.fn();
  });

  it("should have a getDiceResults function", () => {
    expect(typeof DiceResultController.getDiceResults).toBe("function");
  });

  it("should call DiceResultModel.get", async () => {
    await DiceResultController.getDiceResults(req, res, next);
    expect(DiceResultModel.get).toBeCalled();
  });

  it("should return 200 and json body on success", async () => {
    DiceResultModel.get.mockReturnValue(existingDiceResults);

    await DiceResultController.getDiceResults(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(existingDiceResults);
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "GET error!" };
    const rejectedPromise = Promise.reject(errorMessage);
    DiceResultModel.get.mockReturnValue(rejectedPromise);

    await DiceResultController.getDiceResults(req, res, next);
    expect(res.statusCode).toBe(500);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe("DiceResultController.deleteDiceResults", () => {
  it("should have a deleteDiceResults function", () => {
    expect(typeof DiceResultController.deleteDiceResults).toBe("function");
  });

  it("should call DiceResultModel.remove", async () => {
    await DiceResultController.deleteDiceResults(req, res, next);
    expect(DiceResultModel.remove).toBeCalled();
  });

  it("should return a 204 and no content on success", async () => {
    await DiceResultController.deleteDiceResults(req, res, next);
    expect(res.statusCode).toBe(204);
    expect(res._isEndCalled()).toBeTruthy();
    expect(!res.body).toBeTruthy();
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "DELETE error!" };
    const rejectedPromise = Promise.reject(errorMessage);
    DiceResultModel.remove.mockReturnValue(rejectedPromise);

    await DiceResultController.deleteDiceResults(req, res, next);
    expect(res.statusCode).toBe(500);
    expect(next).toBeCalledWith(errorMessage);
  });
});
