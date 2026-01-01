type EventHandler = (payload?: unknown) => void;

export class EventBus {
  private subscribers: Record<string, EventHandler[]> = {};

  on(event: string, handler: EventHandler): void {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }
    this.subscribers[event].push(handler);
  }

  emit(event: string, payload?: unknown): void {
    const handlers = this.subscribers[event];
    if (!handlers) return;

    handlers.forEach((handler) => handler(payload));
  }
}
