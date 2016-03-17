declare namespace Core {
    export interface IFactory<T> {
        create(): T;
    }
}