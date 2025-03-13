class TaskScheduler {
  constructor(concurrency) {
    this.concurrency = Number(concurrency);
    this.runningTasks = 0;
    this.__waitingQueue = [];
  }

  getNextTask() {
    if (
      this.runningTasks < this.concurrency &&
      this.__waitingQueue.length > 0
    ) {
      const nextTask = this.__waitingQueue.shift();
      nextTask();
    }
  }

  addTask(task) {
    return new Promise((resolve, reject) => {
      async function __taskRunner() {
        this.runningTasks += 1;
        try {
          const result = await task();
          console.log("Result", result);
          resolve(result);
        } catch (error) {
          console.log("Task Failed", error);
          reject(error);
        } finally {
          this.runningTasks -= 1;
          this.getNextTask();
        }
      }

      if (this.runningTasks < this.concurrency) {
        __taskRunner.call(this);
      } else {
        this.__waitingQueue.push(__taskRunner.bind(this));
      }
    });
  }
}

const scheduler = new TaskScheduler(3);

scheduler.addTask(
  () => new Promise((res) => setTimeout(() => res("Task 1"), 5 * 1000))
);

scheduler.addTask(
  () => new Promise((res) => setTimeout(() => res("Task 2"), 5 * 500))
);

scheduler.addTask(
  () => new Promise((res) => setTimeout(() => res("Task 3"), 5 * 300))
);

scheduler.addTask(
  () => new Promise((res) => setTimeout(() => res("Task 4"), 5 * 400))
);
