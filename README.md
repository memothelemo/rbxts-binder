# @rbxts/binder

Typings for Quenty's Binder (a Nevermore module), a module uses CollectionService to make tagged objects run by its own custom component classes

## Usage

```ts
import Binder from "@rbxts/binder";

class Disco implements Binder.BinderClass {
	Instance: Part;

	constructor(instance: Instance) {
		assert(
			classIs(instance, "Part"),
			"Instance parameter must be Part instance",
		);
		this.Instance = instance;
	}

	Update() {
		this.Instance.BrickColor = BrickColor.random();
	}

	Destroy() {}
}

const discoBinder = new Binder("Disco", Disco);
discoBinder.Start();

game
	.GetService("RunService")
	.Heartbeat.Connect(() =>
		discoBinder.GetAll().forEach((object) => object.Update()),
	);
```
