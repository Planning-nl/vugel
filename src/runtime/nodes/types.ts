import { Node } from "./Node";
import { Image } from "./Image";
import { Rectangle } from "./Rectangle";
import { Text } from "./Text";
import { Stage } from "tree2d/lib";
import { Base } from "./Base";
import { Paragraph } from "./Paragraph";
import { Container } from "./Container";
import { SpecialRectangle } from "./SpecialRectangle";

const types: Record<string, new (stage: Stage) => Base> = {
    node: Node,
    container: Container,
    image: Image,
    rectangle: Rectangle,
    text: Text,
    paragraph: Paragraph,
    "special-rectangle": SpecialRectangle,
};

export default types;
