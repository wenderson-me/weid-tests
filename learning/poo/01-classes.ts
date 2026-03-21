class User {
  name: string;
  email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }

  greet(): string {
    return `Olá, meu nome é ${this.name}`;
  }
}

class BankAccount {
  public owner: string;
  private balance: number;
  protected bank: string;

  constructor(owner: string, balance: number) {
    this.owner = owner;
    this.balance = balance;
    this.bank = 'Banco X';
  }

  getBalance(): number {
    return this.balance;
  }

  deposit(amount: number): void {
    if (amount <= 0) throw new Error('Valor inválido');
    this.balance += amount;
  }
}

class Product {
  readonly id: string;
  private _price: number;

  constructor(id: string, private name: string, price: number) {
    this.id = id;
    this._price = price;
  }

  get price(): number {
    return this._price;
  }

  set price(value: number) {
    if (value < 0) throw new Error('Preço não pode ser negativo');
    this._price = value;
  }

  get summary(): string {
    return `${this.name} - R$${this._price.toFixed(2)}`;
  }
}

const user = new User('Wenderson', 'wend@email.com');
console.log(user.greet());

const account = new BankAccount('Wenderson', 1000);
account.deposit(500);
console.log(`Saldo: ${account.getBalance()}`);

const notebook = new Product('1', 'Notebook', 3500);
notebook.price = 3200;
console.log(notebook.summary);
