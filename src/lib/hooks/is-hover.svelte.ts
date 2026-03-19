export class IsHover {
  #current = $state(true);

  constructor() { }

  get current() {
    return this.#current;
  }

  destroy() { }
}