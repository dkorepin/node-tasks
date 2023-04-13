import { ValidationErrorItem } from "joi";
import { errorResponse } from "./helpers";

const simpeError = {
  message: "login is empty",
  path: ["login"],
};
const basicMock: ValidationErrorItem[] = [
  {
    ...simpeError,
    type: "validation",
  },
];
describe("error response helper", () => {
  it("should return errors", () => {
    expect(errorResponse(basicMock)).toStrictEqual({ status: "failed", errors: [simpeError] });
  });
});
