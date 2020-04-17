import { Picture } from "./textures";
import { Rectangle } from "./textures";
import { Text } from "./textures";
import { Base } from "./Base";
import { Paragraph } from "./Paragraph";
import { Container } from "./Container";
import { SpecialRectangle } from "./textures";
import { Drawing } from "./textures";
import { Texture } from "./textures";
import { Svg } from "./textures";
import { Grayscale } from "./effects";
import { Rounded } from "./effects";
import { Shader } from "./effects";
import { BoxBlur } from "./effects";
import { VugelStage } from "../../wrapper";

export const types: Record<string, new (stage: VugelStage) => Base> = {
    container: Container,

    // textures
    picture: Picture,
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
} as const;
