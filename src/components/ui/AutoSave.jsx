// AutoSave utility class for handling automatic document saving
class AutoSave {
  constructor(saveCallback, interval = 30000) {
    this.saveCallback = saveCallback;
    this.interval = interval;
    this.timeoutId = null;
    this.isScheduled = false;
  }

  // Schedule an auto-save operation
  schedule(data) {
    // Clear any existing timeout
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Schedule new auto-save
    this.timeoutId = setTimeout(() => {
      if (this.saveCallback && typeof this.saveCallback === 'function') {
        this.saveCallback(data, true); // true indicates this is an auto-save
      }
      this.isScheduled = false;
    }, this.interval);

    this.isScheduled = true;
  }

  // Cancel scheduled auto-save
  cancel() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
      this.isScheduled = false;
    }
  }

  // Check if auto-save is currently scheduled
  isPending() {
    return this.isScheduled;
  }

  // Trigger immediate save
  saveNow(data) {
    this.cancel(); // Cancel scheduled save
    if (this.saveCallback && typeof this.saveCallback === 'function') {
      this.saveCallback(data, false); // false indicates manual save
    }
  }

  // Update the save interval
  setInterval(newInterval) {
    this.interval = newInterval;
  }

  // Cleanup - call this when component unmounts
  destroy() {
    this.cancel();
    this.saveCallback = null;
  }
}

export { AutoSave };