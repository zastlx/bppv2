import logger from "./logger";

class Events {
    private subscriptions = new Map();

    subscribe(event, callback) {
        logger.info("Events", `Subscribed to event '${event}'.`);
        if (!this.subscriptions.has(event)) this.subscriptions.set(event, new Set());
        this.subscriptions.get(event).add(callback);
    }

    dispatch(event, payload) {
        logger.info("Events", `Dispatched event '${event}'.`);
        if (this.subscriptions.has(event)) this.subscriptions.get(event).forEach((callback) => callback(payload));
    }
}

const events = new Events();
export default events;
export { Events };