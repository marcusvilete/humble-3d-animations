export class Time {
    static deltaTime = 0;
    static time = 0;
    
    static computeTime(now: number) {
        now *=  0.001;
        this.deltaTime = now - this.time;
        this.time = now;
    }
}
