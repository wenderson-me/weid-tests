// S - Single Responsibility

class UserService {
  constructor(private repo: UserRepository) {}

  create(name: string, email: string): User {
    const user = { id: crypto.randomUUID(), name, email };
    this.repo.save(user);
    return user;
  }

  findByEmail(email: string): User | undefined {
    return this.repo.findByEmail(email);
  }
}

class EmailService {
  send(to: string, subject: string, body: string): void {
    console.log(`Enviando para ${to}: ${subject}`);
  }
}

// O - Open/Closed

interface Discount {
  calculate(price: number): number;
}

class PercentDiscount implements Discount {
  constructor(private percent: number) {}
  calculate(price: number): number {
    return price * (1 - this.percent / 100);
  }
}

class FixedDiscount implements Discount {
  constructor(private amount: number) {}
  calculate(price: number): number {
    return Math.max(0, price - this.amount);
  }
}

class NoDiscount implements Discount {
  calculate(price: number): number {
    return price;
  }
}

function applyDiscount(price: number, discount: Discount): number {
  return discount.calculate(price);
}

// L - Liskov Substitution

abstract class Bird {
  abstract move(): string;
}

class Sparrow extends Bird {
  move(): string {
    return 'Voando';
  }
}

class Ostrich extends Bird {
  move(): string {
    return 'Correndo';
  }
}

function makeBirdMove(bird: Bird): string {
  return bird.move();
}

// I - Interface Segregation

interface Readable {
  read(): string;
}

interface Writable {
  write(data: string): void;
}

interface Deletable {
  delete(): void;
}

class FileStorage implements Readable, Writable, Deletable {
  private content = '';

  read(): string {
    return this.content;
  }
  write(data: string): void {
    this.content = data;
  }
  delete(): void {
    this.content = '';
  }
}

class ReadOnlyConfig implements Readable {
  constructor(private data: string) {}
  read(): string {
    return this.data;
  }
}

// D - Dependency Inversion

interface UserRepository {
  save(user: User): void;
  findByEmail(email: string): User | undefined;
}

interface User {
  id: string;
  name: string;
  email: string;
}

class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  save(user: User): void {
    this.users.push(user);
  }

  findByEmail(email: string): User | undefined {
    return this.users.find(u => u.email === email);
  }
}

const repo = new InMemoryUserRepository();
const userService = new UserService(repo);
const emailService = new EmailService();

const newUser = userService.create('Wenderson', 'wend@email.com');
emailService.send(newUser.email, 'Bem-vindo', 'Conta criada com sucesso');

console.log(userService.findByEmail('wend@email.com'));

console.log(applyDiscount(100, new PercentDiscount(20)));
console.log(applyDiscount(100, new FixedDiscount(30)));
console.log(applyDiscount(100, new NoDiscount()));

console.log(makeBirdMove(new Sparrow()));
console.log(makeBirdMove(new Ostrich()));

const file = new FileStorage();
file.write('dados importantes');
console.log(file.read());

const config = new ReadOnlyConfig('NODE_ENV=production');
console.log(config.read());
