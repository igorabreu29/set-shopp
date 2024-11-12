import { randomUUID } from "node:crypto"

export class UniqueEntityId {
  private value: string

  toValue() {
    return this.value
  }

  constructor(value?: string) {
    this.value = value ?? randomUUID()
  }

  public equals(id: UniqueEntityId): boolean {
    return id.toValue() === this.value
  }
}