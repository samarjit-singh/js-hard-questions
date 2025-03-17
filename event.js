class MyEventEmitter {
  constructor() {
    // [event]: listners[]
    this.__event_listeners = {};
  }

  on(event, listener) {
    // Register the [listners] for [event]
    if (!this.__event_listeners[event]) {
      this.__event_listeners[event] = [];
    }

    this.__event_listeners[event].push(listener);

    return true;
  }

  emit(event, ...args) {
    if (!this.__event_listeners[event]) {
      return false;
    }

    const listeners = this.__event_listeners[event];

    listeners.forEach((listener) => listener(...args));
  }

  off(event, listener) {
    if (!this.__event_listeners[event]) {
      return false;
    }

    const index = this.__event_listeners[event].indexOf(listener);

    if (index < 0) {
      return false;
    }

    this.__event_listeners[event].splice(index, 1);
    return true;
  }

  once(event, listener) {
    const wrapperFn = (...args) => {
      listener(...args);
      this.off(event, wrapperFn);
    };

    this.on(event, wrapperFn);
    return true;
  }
}

const e = new MyEventEmitter();

const sendWhatsapp = (username) => console.log("WhatsApp to", username);

e.on("user:signup", (username) => console.log("User sign up"));
e.once("user:signup", (username) => console.log("Sending Email to", username));
e.once("user:signup", sendWhatsapp);
e.on("user:logout", (username) => console.log("logout", username));

e.emit("user:signup", "@Samarjit");
e.emit("user:signup", "@Samarjit-2");

// e.off("user:signup", sendWhatsapp);

e.emit("user:signup", "@Samarjit-3");
e.emit("user:logout", "@Samarjit");
