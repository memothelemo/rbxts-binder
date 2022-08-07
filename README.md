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

class Disco {
	constructor(public readonly instance: Instance) {
		assert(classIs(instance, "Part"), "Invalid argument #1, Part expected");
	}

	Update() {
		this.instance.BrickColor = BrickColor.random();
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

### Creating Binder from a function or object

It is the same thing as you normally do in Binder from Luau.

**Function**
```ts
const binder = new Binder("Bird", (inst) => {
    print("Wow, a new bird!", inst);
    return {
        Destroy() {
     	    print("Uh oh, the bird is gone!");
        },
    };
});

binder.Start();
```

**Object**
```ts
// Create method is required
const binder = new Binder("Hello", {
    Create(instance: Instance) {
        print("Wow a new bird!", instance);
        return {
            Destroy() {
                print("Uh oh, the bird is gone!");
            },
        };
    },
});
```

### Creating Binder from class prototype

When creating Binder base class, make sure the first parameter
of the constructor function must be `Instance` type otherwise it will
result a type mismatch error.

**Example**:
```ts
class DummyBinder {
	constructor(instance: Instance) {
		print(`${instance.GetFullName()} spawned!`);
	}
}
```

## Destroying component

You may want to make either `Destroy` method either in `lowercase` or `PascalCase`
so that Binder can call it and automatically call the method.
