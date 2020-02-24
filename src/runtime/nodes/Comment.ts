import Base from "./Base";

export default class Comment extends Base {
    public readonly text: string;

    constructor(text: string) {
        super(undefined);
        this.text = text;
    }
}
