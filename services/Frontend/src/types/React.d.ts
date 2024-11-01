declare module "react" {
    interface DOMAttributes<T> {
        inert?: boolean;
    }
}

declare global {
    namespace JSX {
        interface IntrinsicAttributes {
            inert?: boolean;
        }
    }
}

export {};
