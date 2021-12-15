class EventDelegate {
    readonly host: EventTarget;
    readonly selector: string;
    protected eventName?: string;
    protected options?: boolean | AddEventListenerOptions;
    protected handler?: EventListener;

    constructor(host: EventTarget, selector: string) {
        this.host = host;
        this.selector = selector;
    }

    addEventListener(eventName: string, handler: EventListener, options?: boolean | AddEventListenerOptions) {
        this.eventName = eventName;
        this.handler = function (ev: Event) {
            for (let target: HTMLElement | null = <HTMLElement | null>ev.target; target && target != this.host; target = target.parentElement) {
                if (target.matches(this.selector)) {
                    handler.call(target, ev);
                    break;
                }
            }
        };
        this.options = options;

        this.host.addEventListener(this.eventName, this.handler, this.options);
    }

    removeEventListener() {
        if (this.eventName && this.handler)
            this.host.addEventListener(this.eventName, this.handler, this.options);
    }
}

window["EventDelegate"] = (host: EventTarget, selector: string) => new EventDelegate(host, selector);
