## @rbxts/binder

Typings for Quenty's Binder (a Nevermore module)

## Installation

**NPM**:
`npm i @rbxts/binder`

**Yarn**:
`yarn add @rbxts/binder`

## Usage

```ts
import Binder from "@rbxts/binder";

class Disco implements Binder.BinderClass {
	Instance: Part;

	constructor(instance: Instance) {
		assert(classIs(instance, "Part"), "Invalid argument #1, Part expected");
		this.Instance = instance;
	}

	Update() {
		this.Instance.BrickColor = BrickColor.random();
	}

	Destroy() {}
}

const discoBinder = new Binder("Disco", Disco);
discoBinder.Start();

// have some party!
game.GetService("RunService").Heartbeat.Connect(() => {
	for (const object of discoBinder.GetAll()) {
		object.Update();
	}
});
```

## Differences from the Luau version of Binder

### Creating Binder class

When creating Binder implemented class, make sure the first parameter
of the constructor function must be `Instance` type.

**Example**:
```ts
class DummyClass implements BinderClass {
	constructor(instance: Instance) {
		print(`${instance.GetFullName()} spawned!`);
	}

	Destroy() {}
}
```
