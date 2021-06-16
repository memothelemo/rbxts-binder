/// <reference types="@rbxts/types" />

import Signal from "@rbxts/signal";

declare namespace Binder {
	export interface BinderClass {
		Destroy(): void;
	}

	export type BinderClassConstructor<T extends Binder.BinderClass> = {
		new (instance: Instance): T;
	};
}

interface Binder<T extends Binder.BinderClass = Binder.BinderClass> {
	/** Listens for new instances and connects to the GetInstanceAddedSignal() and removed signal! */
	Start(): void;

	/** Returns the tag name that the binder has */
	GetTag(): string;

	/** Returns whatever was set for the construtor. Used for meta-analysis of the binder, such as extracting new */
	GetConstructor(): Binder.BinderClassConstructor<T>;

	/**
	 * Fired when added, and then after removal, but before destroy!
	 * @param inst Instance
	 * @param callback
	 */
	ObserveInstance(inst: Instance, callback: (classInst: T) => void): () => void;

	/**
	 * Returns a new signal that will fire whenever a class is bound to the binder
	 * @example
	 * // Load bird into binder
	 * const birdBinder = new Binder("Bird", require(path.to.Bird) as typeof Bird);
	 * birdBinder.GetClassAddedSignal().Connect(bird => {
	 * 	// Make the bird squack when it's first spawned
	 *  bird.Squack();
	 * });
	 *
	 * // Load all birds
	 * birdBinder.Init()
	 */
	GetClassAddedSignal(): Signal<(classInst: T, inst: Instance) => void>;

	/** Returns a new signal that will fire whenever a class is removed from the binder */
	GetClassRemovingSignal(): Signal<(classInst: T, inst: Instance) => void>;

	/**
	 * Returns all of the classes in a new table
	 * @example
	 * // Load bird into binder
	 * const birdBinder = new Binder("Bird", require(path.to.Bird) as typeof Bird);
	 *
	 * // Update every bird every frame
	 * RunService.Stepped.Connect(() => {
	 * 	birdBinder.GetAll().forEach(bird => bird.Update());
	 * });
	 *
	 * birdBinder.Init()
	 */
	GetAll(): T[];

	/**
	 * for (const [classObj] of thatBinder.GetAllSet()) {}
	 */

	/**
	 * Faster method to get all items in a binder
	 *
	 * **NOTE**: Do not mutate this set directly
	 * @example
	 * // Load bird into binder
	 * const birdBinder = new Binder("Bird", require(path.to.Bird) as typeof Bird);
	 *
	 * // Update every bird every frame
	 * RunService.Stepped.Connect(() => {
	 * 	for (const [bird] of birdBinder.GetAllSet()) {
	 * 		bird:Update()
	 * 	}
	 * }
	 *
	 * birdBinder.Init()
	 */
	GetAllSet(): Array<[T, boolean]>;

	/**
	 * Binds an instance to this binder using collection service and attempts
	 * to return it if it's bound properly
	 *
	 * **NOTE**: Do not assume that a bound object will be retrieved
	 * @param instance
	 */
	Bind(instance: Instance): void;

	/** Unbinds the instance by removing the tag */
	Unbind(instance: Instance): void;

	/**
	 * See ``.Bind()``
	 *
	 * Acknowledges the risk of doing this on the client.
	 * Using this acknowledges that we're intentionally binding on a safe client object,
	 * i.e. one without replication. If another tag is changed on this instance, this tag will be lost/changed.
	 */
	BindClient(instance: Instance): T;

	/**
	 * See ``Unbind()``
	 *
	 * Acknowledges risk of doing this on the client.
	 */
	UnbindClient(instance: Instance): void;

	/**
	 * Returns a version of the class
	 * @param instance
	 */
	Get(instance: Instance): T;

	/** Cleans up all bound classes, and disconnects all events */
	Destroy(): void;
}

interface BinderConstructor {
	/** ClassName of Binder */
	readonly ClassName: string;

	/**
	 * Creates a new binder object.
	 * @constructor new Binder(tagName, constructor)
	 * @param tagName Name of the tag to bind to. This uses CollectionService's tag system
	 * @param constructor A constructor to create the new class.
	 * @returns Binder
	 */
	new <T extends Binder.BinderClass>(tag: string, constructor: Binder.BinderClassConstructor<T>): Binder<T>;

	/**
	 * Retrieves whether or not its a binder
	 * @param value
	 * @returns boolean
	 */
	isBinder: <T extends Binder.BinderClass>(object: unknown) => object is Binder<T>;
}

/**
 * Bind class to Roblox Instance
 * @classmod Binder
 * @author Quenty
 * @editor memothelemo
 */
declare const Binder: BinderConstructor;
export = Binder;
