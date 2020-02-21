import Node from './Node'

export default class Rect extends Node {
  constructor(stage: typeof lng.Stage) {
    super(stage)
    this.element.texture = stage.rectangleTexture
  }
}
