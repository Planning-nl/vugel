import Node from './Node';
import Image from './Image';
import Rect from './Rect';
import Text from './Text';

const types: Record<string, any> = {
    node: Node,
    image: Image,
    rect: Rect,
    text: Text,
};

export default types;
