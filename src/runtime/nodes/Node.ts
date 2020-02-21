import Base from './Base'

export default class Node extends Base {
  public readonly stage: typeof lng.Stage

  constructor(stage: typeof lng.Stage, base?: typeof lng.Element) {
    super(base || new lng.Element(stage))
    this.stage = stage
  }

  appendChild(child: Base) {
    super.appendChild(child)
    if (child.element) {
      this.element.childList.add(child.element)
    }
  }

  removeChild(child: Base) {
    super.removeChild(child)
    if (child.element) {
      this.element.childList.remove(child.element)
    }
  }

  insertBefore(child: Base, anchor: Base) {
    super.insertBefore(child, anchor)
    if (child.element) {
      const baseAnchor = this.getBaseAnchor(anchor)
      if (baseAnchor) {
        this.element.childList.insertBefore(child, baseAnchor)
      } else {
        this.element.childList.add(child.element, true)
      }
    }
  }

  /**
   * Returns the nearest base that has an element.
   * @param anchor
   */
  private getBaseAnchor(anchor: Base): Base | undefined {
    if (anchor.element) {
      return anchor
    } else {
      // In case of a v-for with a lot of elements, lastIndexOf will perform faster.
      let index = this.children.lastIndexOf(anchor)
      if (index !== -1) {
        const n = this.children.length
        while (++index < n) {
          if (this.children[index].element) {
            return this.children[index]
          }
        }
      }
      return undefined
    }
  }

  clearChildren() {
    this.children.forEach(child => (child.parentNode = undefined))
    this.children = []
    this.element.childList.clear()
  }

  set onActive(v: any) {
    if (v === undefined || isFunction(v)) {
      this.element.onActive = v
    }
  }

  set x(v: any) {
    this.element.x = ensureFloat(v)
  }

  set y(v: any) {
    this.element.y = ensureFloat(v)
  }

  set scale(v: any) {
    this.scaleX = ensureFloat(v)
    this.scaleY = ensureFloat(v)
  }

  set scaleX(v: number) {
    this.element.scaleX = ensureFloat(v)
  }

  set scaleY(v: number) {
    this.element.scaleY = ensureFloat(v)
  }

  set rotation(v: number) {
    this.element.rotation = ensureFloat(v)
  }

  set alpha(v: number) {
    this.element.alpha = ensureFloat(v)
  }

  set visible(v: boolean) {
    this.element.visible = ensureBoolean(v)
  }

  set color(v: number) {
    this.element.color = ensureInt(v)
  }

  set w(v: number) {
    this.element.w = ensureFloat(v)
  }

  set h(v: number) {
    this.element.h = ensureFloat(v)
  }
}

export function ensureInt(v: any): number {
  return parseInt(v as any) || 0
}

export function ensureFloat(v: any): number {
  return parseFloat(v as any) || 0.0
}

export function ensureBoolean(v: any): boolean {
  return v !== 'false' && !!v
}

const isFunction = (val: unknown): val is Function =>
    typeof val === 'function'

