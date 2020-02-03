function Stopwatch(timer, freq, callbackDuringTimer, callbackTimeOut) {
    this.currentTimeTimer = timer;
    this.timer = timer;
    this.intervalId = null;
    this.callbackDuringTimer = callbackDuringTimer;
    this.callbackTimeOut = callbackTimeOut;
    this.freq = freq;

    this.start = () => {
        this.intervalId = setInterval(() => {
            this.callbackDuringTimer(this.currentTimeTimer);
            this.currentTimeTimer -= this.freq;
        }, this.freq);

        setTimeout(() => {
            this.callbackDuringTimer(this.currentTimeTimer);
            this.callbackTimeOut();
            clearInterval(this.intervalId);
        }, this.timer);
    };

    this.stop = () => {
        clearInterval(this.intervalId);
        this.intervalId = null;
    }

    this.addExtraTime = (extraTime) => {
        this.stop();
        this.currentTimeTimer += extraTime;
        this.timer = this.currentTimeTimer;
        this.start();
    }
}

module.exports.Stopwatch = Stopwatch;