'use client';

import { useEffect, useState } from 'react';

interface User {

  id: number;

  name: string;

}

export default function Home() {

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {

    fetch('/api/users')

      .then(res => res.json())

      .then(setUsers);

  }, []);

  return (

    <div className="p-4">

      <h1 className="text-2xl font-bold mb-4">Users</h1>

      <ul className="list-disc pl-5">

        {users.map(user => <li key={user.id}>{user.name}</li>)}

      </ul>

    </div>

  );

}