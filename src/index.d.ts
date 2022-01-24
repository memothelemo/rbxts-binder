/* eslint-disable @typescript-eslint/no-explicit-any */

import Signal from "@rbxts/signal";

declare namespace Binder {
  export type BinderClassConstructor<Class extends object, Args extends any[]> =
    | {
        new (instance: Instance, ...args: Args): Class;
      }
    | ((instance: Instance, ...args: Args) => Class)
    | {
        Create(instance: Instance, ...args: Args): Class;
      };
}

// Class extends object, Args extends any[] = []

interface Binder<Constructor extends Binder.BinderClassConstructor<any, any[]>> {
  /**
   * Filters binded objects with a whilelist of descendants.
   *
   * This will prevent from any binded objects from creating
   * a new instance if the object is out of descendant of the whitelist.
   */
  SetDescendantsWhitelist(descendants: Instance[]): void;

  /**
   * Listens for new instances and connects to the `GetInstanceAddedSignal()` and removed signal!
   */
  Start(): void;

  /**
   * Returns the tag name that the binder has.
   * @returns Tag name
   */
  GetTag(): string;

  /**
   * Returns whatever was set for the constructor. Used for meta-analysis of
   * the binder, such as extracting if parameters are allowed.
   *
   * @returns `BinderClassConstructor`
   */
  GetConstructor(): Constructor;

  /**
   * Fired when added, and then after removal, but before destroy!
   *
   * @param inst Instance to observe
   * @param callback Callback to recieve any activites to the instance
   * @returns Cleanup function
   */
  ObserveInstance(inst: Instance, callback: (instance: InferClass<Constructor>) => void): () => void;

  /**
   * Returns a new signal that will fire whenever a class is bound to the binder
   *
   * ```ts
   * const birdBinder = new Binder("Bird", require(path.to.Bird) as typeof Bird);
   * birdBinder.GetClassAddedSignal().Connect((bird) => {
   *  bird.Squack(); // Make the bird squack when it's first spawned
   * });
   *
   * // Load all birds
   * bird.Start();
   * ```
   *
   * @returns Signal object
   */
  GetClassAddedSignal(): Signal<(classInstance: InferClass<Constructor>, instance: Instance) => void>;

  /**
   * Returns a new signal that will fire whenever a class is removing from the binder.
   * @returns Signal object
   */
  GetClassRemovingSignal(): Signal<(classInstance: InferClass<Constructor>, instance: Instance) => void>;

  /**
   * Returns all of the classes in a new table.
   *
   * ```ts
   * const birdBinder = new Binder("Bird", require(path.to.Bird) as typeof Bird);
   *
   * // Update every bird every frame
   * RunService.Stepped.Connect(() => {
   *  for (const bird of birdBinder.GetAll()) {
   *    bird.Update();
   *  }
   * });
   *
   * birdBinder.Start();
   * ```
   */
  GetAll(): InferClass<Constructor>[];

  /**
   * Faster method to get all items in a binder
   *
   * ```ts
   * const birdBinder = new Binder("Bird", require(path.to.Bird) as typeof Bird);
   *
   * // Update every bird every frame
   * RunService.Stepped.Connect(() => {
   *  for (const [bird, _] of birdBinder.GetAllSet()) {
   *    bird.Update();
   *  }
   * });
   *
   * birdBinder.Start();
   * ```
   *
   * **WARNING**: Do not mutate this set directly
   * @returns Set of class instances
   */
  GetAllSet(): Set<InferClass<Constructor>>;

  /**
   * Binds an instance to this binder using collection service and attempts
   * to return it if it's bound properly. See BinderUtils.promiseBoundClass() for a safe
   * way to retrieve it.
   *
   * **WARNING**: Do not assume that a bound object will be retrieved
   *
   * @server
   * @param inst Instance to check
   * @returns Bound class or undefined
   */
  Bind(inst: Instance): InferClass<Constructor> | undefined;

  /**
   * Unbinds the instance by removing the tag.
   *
   * @server
   * @param inst Instance to unbind
   */
  Unbind(inst: Instance): void;

  /**
   * See `Bind()`, acknowledges the risk of doing this on the client.
   *
   * Using this acknowledges that we're intentionally binding on a safe client object,
   * i.e. one without replication. If another tag is changed on this instance, this tag will be lost/changed.
   *
   * @client
   * @param inst Instance to bind
   * @return Bound class or undefined
   */
  BindClient(inst: Instance): InferClass<Constructor> | undefined;

  /**
   * See `Unbind()`, acknowledges risk of doing this on the client.
   *
   * @client
   * @param inst Instance to unbind
   */
  UnbindClient(inst: Instance): void;

  /**
   * Returns a instance of the class that is bound to the instance given.
   *
   * @param inst Instance to check
   * @returns Class
   */
  Get(inst: Instance): InferClass<Constructor> | undefined;

  /**
   * Returns a promise which will resolve when the instance is bound.
   *
   * @param inst Instance to check
   * @returns Promise<Class>
   */
  Promise(inst: Instance): Promise<InferClass<Constructor>>;

  /**
   * Cleans up all bound classes, and disconnects all events.
   */
  Destroy(): void;
}

type InferConstructArgs<C extends Binder.BinderClassConstructor<any, any[]>> = C extends Binder.BinderClassConstructor<
  any,
  infer A
>
  ? A
  : never;

type InferClass<C extends Binder.BinderClassConstructor<any, any[]>> = C extends Binder.BinderClassConstructor<
  infer T,
  any
>
  ? T
  : never;

interface BinderConstructor {
  /**
   * Class name of Binder.
   */
  readonly ClassName: string;

  /**
   * Constructs a new binder object.
   *
   * ```ts
   * const binder = new Binder("Bird", (inst) => {
   *  print("Wow, a new bird!", inst);
   *  return {
   *    Destroy() {
   *      print("Uh oh, the bird is gone!");
   *    },
   *  };
   * });
   *
   * binder.Start();
   * ```
   */
  new <Constructor extends Binder.BinderClassConstructor<any, any[]>>(
    tagName: string,
    constructor: Constructor,
    ...args: InferConstructArgs<Constructor>
  ): Binder<Constructor>;

  /**
   * Retrieves whether or not the given value is a binder.
   *
   * @param value Any value to check if it is Binder
   * @returns boolean true or false, whether or not it is a value
   */
  isBinder: <Constructor extends Binder.BinderClassConstructor<any, any[]>>(
    value: unknown | Binder<Constructor>,
  ) => value is Binder<Constructor>;
}

/**
 * Bind class to Roblox Instance
 * @classmod Binder
 * @author Quenty
 * @editor memothelemo
 */
declare const Binder: BinderConstructor;
export = Binder;
