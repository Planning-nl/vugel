import Node from "./Node";
import Image from "./Image";
import Rect from "./Rect";
import Text from "./Text";
import Stage from "tree2d/dist/tree/Stage";
import Base from "./Base";
import Paragraph from "./Paragraph";

const types: Record<string, new (stage: Stage) => Base> = {
    node: Node,
    image: Image,
    rect: Rect,
    text: Text,
    paragraph: Paragraph,
};

export default types;
