import Binder from "index";

class Birdy {
  public constructor(public readonly instance: Instance, privateId: string) {}

  public Update() {}
}

const birdBinder = new Binder("Bird", Birdy, "Hi!");
birdBinder.GetAll().forEach((birdy) => birdy.Update());

const hello = new Binder("Eyes", () => ({
  Destroy() {},
}));

hello.GetConstructor()();
