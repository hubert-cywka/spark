export type ModuleWithHotReload = {
    hot: {
        accept: () => unknown;
        dispose: (callback: () => unknown) => unknown;
    };
};
