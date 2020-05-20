import { Container } from "./Container";
import { Node } from "./Node";
import { mixin } from "../utils/mixin";
import { Constructor } from "../utils/TypeUtils";
import { ConvertedDirectNode, DirectContainerMixin, getDirectType } from "./direct";

/**
 * Allows direct child mutations.
 * Disables vue vdom patching.
 */
export class DirectContainer extends Container {
    create<T extends Node>(nodeType: Constructor<T>): ConvertedDirectNode<T> {
        const directType = getDirectType(nodeType);
        return new directType(this.stage) as any;
    }
}

mixin(DirectContainer, DirectContainerMixin);

export interface DirectContainer extends DirectContainerMixin {}
