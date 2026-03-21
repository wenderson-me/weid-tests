class Animal {
  constructor(protected name: string) {}

  move(distance: number): string {
    return `${this.name} moveu ${distance}m`;
  }
}

class Dog extends Animal {
  bark(): string {
    return `${this.name}: Au au!`;
  }

  move(distance: number): string {
    return `${this.name} correu ${distance}m`;
  }
}

class Bird extends Animal {
  move(distance: number): string {
    return `${this.name} voou ${distance}m`;
  }
}

abstract class Shape {
  abstract area(): number;
  abstract perimeter(): number;

  describe(): string {
    return `Área: ${this.area().toFixed(2)}, Perímetro: ${this.perimeter().toFixed(2)}`;
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  area(): number {
    return Math.PI * this.radius ** 2;
  }

  perimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}

class Rectangle extends Shape {
  constructor(private width: number, private height: number) {
    super();
  }

  area(): number {
    return this.width * this.height;
  }

  perimeter(): number {
    return 2 * (this.width + this.height);
  }
}

const rex = new Dog('Rex');
console.log(rex.bark());
console.log(rex.move(10));

const parrot = new Bird('Loro');
console.log(parrot.move(50));

const circle = new Circle(5);
console.log(circle.describe());

const rect = new Rectangle(10, 4);
console.log(rect.describe());
