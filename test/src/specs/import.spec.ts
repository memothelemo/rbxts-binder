/// <reference types="@rbxts/testez/globals" />

export = () => {
  describe("importing its dependencies test", () => {
    it("should not go wrong", () => {
      expect(() => import("@rbxts/binder").await()).to.be.ok();
    });
  });
};
