import { Image } from "./textures/Image";
import { Rectangle } from "./textures/Rectangle";
import { Text } from "./textures/Text";
import { Stage } from "tree2d/lib";
import { Base } from "./Base";
import { Paragraph } from "./Paragraph";
import { Container } from "./Container";
import { SpecialRectangle } from "./textures/SpecialRectangle";
import { Drawing } from "./textures/Drawing";
import { Texture } from "./textures/Texture";
import { Svg } from "./textures/Svg";
import { Grayscale } from "./effects/Grayscale";
import { Rounded } from "./effects/Rounded";
import { Shader } from "./effects/Shader";
import { BoxBlur } from "./effects/BoxBlur";

const types: Record<string, new (stage: Stage) => Base> = {
    container: Container,

    // textures
    image: Image,
    rectangle: Rectangle,
    text: Text,
    "special-rectangle": SpecialRectangle,
    drawing: Drawing,
    texture: Texture,
    svg: Svg,

    // effects
    grayscale: Grayscale,
    rounded: Rounded,
    "box-blur": BoxBlur,
    shader: Shader,

    // advanced
    paragraph: Paragraph,
};

export default types;
