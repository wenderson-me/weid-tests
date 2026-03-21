class DataStore<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  get(index: number): T {
    return this.items[index];
  }

  getAll(): T[] {
    return [...this.items];
  }

  find(predicate: (item: T) => boolean): T | undefined {
    return this.items.find(predicate);
  }

  filter(predicate: (item: T) => boolean): T[] {
    return this.items.filter(predicate);
  }

  count(): number {
    return this.items.length;
  }
}

interface Task {
  id: number;
  title: string;
  done: boolean;
}

interface Note {
  id: number;
  content: string;
  tag: string;
}

const tasks = new DataStore<Task>();
tasks.add({ id: 1, title: 'Estudar POO', done: false });
tasks.add({ id: 2, title: 'Praticar TS', done: true });
tasks.add({ id: 3, title: 'Revisar generics', done: false });

const pending = tasks.filter(t => !t.done);
console.log('Pendentes:', pending);

const notes = new DataStore<Note>();
notes.add({ id: 1, content: 'Lembrar de usar composição', tag: 'estudo' });
notes.add({ id: 2, content: 'Deploy sexta', tag: 'trabalho' });

const study = notes.find(n => n.tag === 'estudo');
console.log('Nota encontrada:', study);
