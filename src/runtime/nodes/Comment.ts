import { Base } from "./Base";

export class Comment extends Base {
    public readonly text: string;

    constructor(text: string) {
        super(undefined);
        this.text = text;
    }
}
