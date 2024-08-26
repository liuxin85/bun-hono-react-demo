import { Hono } from 'hono';
import z from 'zod';
import { zValidator } from '@hono/zod-validator';

// source of truth
const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string().min(3).max(100),
  amount: z.number().int().positive(),
});

type Expense = z.infer<typeof expenseSchema>;

const createPostSchema = expenseSchema.omit({ id: true });

const fakeExpense: Expense[] = [
  { id: 1, title: 'Groceries', amount: 50 },
  { id: 2, title: 'Untilties', amount: 100 },
  { id: 3, title: 'Rent', amount: 100 },
];

export const expensesRoute = new Hono()
  .get('/', (c) => {
    return c.json({ expenses: fakeExpense });
  })

  .post('/', zValidator('json', createPostSchema), async (c) => {
    const expense = c.req.valid('json');

    fakeExpense.push({ ...expense, id: fakeExpense.length + 1 });

    c.status(201);
    return c.json(expense);
  })
  .get('/total-spent', async (c) => {
    const total = fakeExpense.reduce((acc, expense) => acc + expense.amount, 0);
    return c.json({ total });
  })
  .get('/:id{[0-9]+}', (c) => {
    const id = Number.parseInt(c.req.param('id'));
    const expense = fakeExpense.find((expense) => expense.id === id);
    if (!expense) {
      return c.notFound();
    }
    return c.json({ expense });
  })
  .delete('/:id{[0-9]+}', (c) => {
    const id = Number.parseInt(c.req.param('id'));

    const index = fakeExpense.findIndex((expense) => expense.id === id);

    if (index === -1) {
      return c.notFound();
    }

    const deletedExpense = fakeExpense.splice(index, 1)[0];

    return c.json({ expense: deletedExpense });
  });
