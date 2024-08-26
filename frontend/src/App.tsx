import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

function App() {
  const [totalSpend, setTotalSepnd] = useState(0);

  useEffect(() => {
    async function fetchTotal() {
      // const res = await fetch('/api/expenses/total-spent');
      const res = await api.expenses['total-spent'].$get();
      const data = await res.json();

      setTotalSepnd(data.total);
    }

    fetchTotal();
  }, []);
  return (
    <>
      <Card className="w-[350px] m-auto">
        <CardHeader>
          <CardTitle>Total Spend</CardTitle>
          <CardDescription>The total amount you've spend</CardDescription>
        </CardHeader>
        <CardContent>{totalSpend}</CardContent>
      </Card>
    </>
  );
}

export default App;
