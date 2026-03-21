interface CanFly {
  fly(): string;
}

interface CanSwim {
  swim(): string;
}

interface CanWalk {
  walk(): string;
}

const flyBehavior: CanFly = {
  fly: () => 'Voando alto',
};

const swimBehavior: CanSwim = {
  swim: () => 'Nadando rápido',
};

const walkBehavior: CanWalk = {
  walk: () => 'Caminhando devagar',
};

class Duck {
  constructor(
    private flyAbility: CanFly,
    private swimAbility: CanSwim,
    private walkAbility: CanWalk,
  ) {}

  fly(): string {
    return this.flyAbility.fly();
  }

  swim(): string {
    return this.swimAbility.swim();
  }

  walk(): string {
    return this.walkAbility.walk();
  }

  describe(): string {
    return [this.fly(), this.swim(), this.walk()].join(' | ');
  }
}

class Penguin {
  constructor(
    private swimAbility: CanSwim,
    private walkAbility: CanWalk,
  ) {}

  swim(): string {
    return this.swimAbility.swim();
  }

  walk(): string {
    return this.walkAbility.walk();
  }
}

const duck = new Duck(flyBehavior, swimBehavior, walkBehavior);
console.log(duck.describe());

const penguin = new Penguin(swimBehavior, walkBehavior);
console.log(penguin.swim());
console.log(penguin.walk());
