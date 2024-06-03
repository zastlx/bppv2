import { ContextDependency } from "react-reconciler";

/* (prop, dep) => {
    if (!dep?.next) return;
    if (!Object.keys(dep.memoizedValue).filter(a => a === prop).length > 0) return findStore(prop, dep.next);
    return dep;
}*/
const findStore = <T>(prop: string, dep: ContextDependency<T>): ContextDependency<T> | undefined => {
    if (!dep?.next) return;
    if (!(Object.keys(dep.memoizedValue).filter((a) => a === prop).length > 0)) return findStore<T>(prop, dep.next as ContextDependency<T>);
    return dep;
};

// const modalStore = findStore<ModalStoreContext>("createModal", Object.entries(document.querySelector("div[class*=\"Body\"]>div")).find((a) => a[0].includes("Fiber"))[1].return.dependencies);


export { findStore };