// @ts-ignore
window.EventDelegate = (host: EventTarget, selector: string) => new EventDelegate(host, selector);

class EventDelegate {
    host: EventTarget;
    selector: string;
    protected eventName?: string;
    protected options?: boolean | AddEventListenerOptions;
    protected handler?: EventListener;

    constructor(host: EventTarget, selector: string) {
        this.host = host;
        this.selector = selector;
    }

    on(eventName: string, handler: EventListener, options?: boolean | AddEventListenerOptions) {
        this.eventName = eventName;
        this.handler = handler;
        this.options = options;

        this.host.addEventListener(this.eventName, this.shouldDelegate.bind(this), this.options);
    }

    off() {
        if (this.eventName && this.handler)
            this.host.addEventListener(this.eventName, this.shouldDelegate.bind(this), this.options);
    }

    shouldDelegate(ev: Event) {
        if(!this.handler) return;
        for (let target: HTMLElement | null = <HTMLElement | null>ev.target; target && target != this.host; target = target.parentElement) {
            if (target.matches(this.selector)) {
                this.handler.call(target, ev);
                break;
            }
        }
    };
}
