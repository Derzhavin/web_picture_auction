function Stopwatch(timer, freq, callback) {
    this.currentTimeTimer = timer;
    this.timer = timer;
    this.intervalId = null;
    this.callback = callback;
    this.freq = freq;

    this.start = () => {
        this.intervalId = setInterval(() => {
            this.callback(this.currentTimeTimer);
            this.currentTimeTimer -= this.freq;
        }, this.freq);

        setTimeout(() => {
            this.callback(this.currentTimeTimer);
            clearInterval(this.intervalId);
        }, this.timer);
    };

    this.stop = () => {this.intervalId = null;}

    this.addExtraTime = (extraTime) => {
        this.stop();
        this.currentTimeTimer += extraTime;
        this.timer = this.currentTimeTimer;
        this.start();
    }
}

module.exports.Stopwatch = Stopwatch;