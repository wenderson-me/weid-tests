interface Authenticatable {
  email: string;
  authenticate(password: string): boolean;
}

interface Loggable {
  log(message: string): void;
}

class Admin implements Authenticatable, Loggable {
  constructor(
    public email: string,
    private passwordHash: string,
  ) {}

  authenticate(password: string): boolean {
    return password === this.passwordHash;
  }

  log(message: string): void {
    console.log(`[${this.email}] ${message}`);
  }
}

interface PaymentMethod {
  pay(amount: number): string;
}

class CreditCard implements PaymentMethod {
  pay(amount: number): string {
    return `Pago R$${amount} no cartão de crédito`;
  }
}

class Pix implements PaymentMethod {
  pay(amount: number): string {
    return `Pago R$${amount} via Pix`;
  }
}

class Boleto implements PaymentMethod {
  pay(amount: number): string {
    return `Boleto de R$${amount} gerado`;
  }
}

function checkout(method: PaymentMethod, amount: number): string {
  return method.pay(amount);
}

const admin = new Admin('admin@weid.com', 'hash123');
console.log(admin.authenticate('hash123'));
admin.log('Sessão iniciada');

console.log(checkout(new Pix(), 150));
console.log(checkout(new CreditCard(), 500));
console.log(checkout(new Boleto(), 200));
