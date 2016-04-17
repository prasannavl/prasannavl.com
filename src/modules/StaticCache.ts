export class PromiseFactory {
    static EmptyResolved = Promise.resolve();
    static TrueResolved = Promise.resolve(true);
    static FalseResolved = Promise.resolve(false);
}