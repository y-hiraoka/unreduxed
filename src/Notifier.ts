type Listener<C> = (container: C) => void;

export class Notifier<C> {
  private listeners: Listener<C>[] = [];

  constructor(public container: C) {}

  notify() {
    for (let i = 0; i < this.listeners.length; i++) {
      this.listeners[i](this.container);
    }
  }

  register(listener: Listener<C>): boolean {
    if (!this.listeners.includes(listener)) {
      this.listeners.push(listener);
      return true;
    } else {
      return false;
    }
  }

  unregister(listener: Listener<C>) {
    this.listeners = this.listeners.filter(item => item !== listener);
  }
}
