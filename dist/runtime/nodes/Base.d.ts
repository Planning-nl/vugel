export default class Base {
    element?: typeof lng.Element;
    protected children: Base[];
    parentNode?: Base;
    nextSibling: Base | null;
    constructor(element: typeof lng.Element | undefined);
    appendChild(child: Base): void;
    removeChild(child: Base): void;
    insertBefore(child: Base, anchor: Base): void;
    clearChildren(): void;
}
