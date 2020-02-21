import Node, { ensureFloat } from './Node'

export default class Text extends Node {
  constructor(stage: typeof lng.Stage) {
    super(stage)
    this.element.texture = new lng.textures.TextTexture(stage)
  }

  set text(value: string) {
    this.element.texture.text = value
  }

  set fontSize(value: number) {
    this.element.texture.fontSize = ensureFloat(value)
  }
}
