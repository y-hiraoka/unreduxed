type Listener<Value> = (value: Value) => void;

export class Notifier<Value> {
  private listeners: Listener<Value>[] = [];

  notify(value: Value) {
    this.listeners.forEach(listener => listener(value));
  }

  register(listener: Listener<Value>): boolean {
    if (!this.listeners.includes(listener)) {
      this.listeners.push(listener);
      return true;
    } else {
      return false;
    }
  }

  unregister(listener: Listener<Value>) {
    this.listeners = this.listeners.filter(item => item !== listener);
  }
}
