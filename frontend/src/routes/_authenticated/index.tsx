import { createFileRoute } from '@tanstack/react-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
// import { useState } from 'react';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export const Route = createFileRoute('/_authenticated/')({
  component: Index,
});

async function getTotalSpent() {
  const res = await api.expenses['total-spent'].$get();

  if (!res.ok) {
    throw new Error('Server error');
  }
  const data = await res.json();
  return data;
}

function Index() {
  const { isPending, error, data } = useQuery({
    queryKey: ['todos'],
    queryFn: getTotalSpent,
  });

  if (error) return 'An error has occurred: ' + error.message;

  return (
    <>
      <Card className="w-[350px] m-auto">
        <CardHeader>
          <CardTitle>Total Spend</CardTitle>
          <CardDescription>The total amount you've spend</CardDescription>
        </CardHeader>
        <CardContent>{isPending ? '...' : data.total}</CardContent>
      </Card>
    </>
  );
}
