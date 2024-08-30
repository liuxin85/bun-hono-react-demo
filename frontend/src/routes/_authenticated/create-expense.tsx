import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { api } from '@/lib/api';
import { createExpenseSchema } from '@server/sharedTypes';
import { Calendar } from '@/components/ui/calendar';

export const Route = createFileRoute('/_authenticated/create-expense')({
  component: CreateExpense,
});

function CreateExpense() {
  const navigate = useNavigate();

  const form = useForm({
    // validator here
    validatorAdapter: zodValidator(),
    defaultValues: {
      title: '',
      amount: '0',
      date: new Date().toISOString(),
    },
    onSubmit: async ({ value }) => {
      // await new Promise((r) => setTimeout(r, 3000));
      // Do something with form data

      const res = await api.expenses.$post({ json: value });
      if (!res.ok) {
        throw new Error('Server error');
      }
      navigate({ to: '/expenses' });
    },
  });
  return (
    <div className="p-2">
      <h2>Create Expense</h2>
      <form
        className="flex flex-col gap-y-4 max-w-3xl m-auto"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="title"
          validators={{
            onChange: createExpenseSchema.shape.title,
          }}
          children={(field) => {
            return (
              <div>
                <Label htmlFor={field.name}>Title</Label>
                <Input
                  type="text"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.isTouched &&
                field.state.meta.errors.length ? (
                  <em>{field.state.meta.errors.join(', ')}</em>
                ) : null}
              </div>
            );
          }}
        />

        <form.Field
          name="amount"
          validators={{
            onChange: createExpenseSchema.shape.amount,
          }}
          children={(field) => (
            <div>
              <Label htmlFor={field.name}>Amount</Label>
              <Input
                type="number"
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <em>{field.state.meta.errors.join(', ')}</em>
              ) : null}
            </div>
          )}
        />

        <form.Field
          name="date"
          validators={{
            onChange: createExpenseSchema.shape.date,
          }}
          children={(field) => (
            <div className="self-center">
              <Calendar
                mode="single"
                selected={new Date(field.state.value)}
                onSelect={(date) =>
                  field.handleChange((date ?? new Date()).toLocaleDateString())
                }
                className="rounded-md border"
              />
              {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <em>{field.state.meta.errors.join(', ')}</em>
              ) : null}
            </div>
          )}
        />

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? '...' : 'Submit'}
            </Button>
          )}
        />
      </form>
    </div>
  );
}
