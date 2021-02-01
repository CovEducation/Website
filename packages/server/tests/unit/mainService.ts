import { expect } from "chai";
import MainService from "../../src/services/MainService";

describe("Main Service", () => {
  describe("::doubleNum()", () => {
    it("doubles a number", () => {
      const ans = MainService.doubleNum(10);
      expect(ans).to.be.approximately(20, 0.00000001);
    });
  });
});
