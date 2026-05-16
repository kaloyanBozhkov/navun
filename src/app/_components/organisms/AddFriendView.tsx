"use client";

import { useState, useTransition } from "react";
import { Button } from "@/app/_components/atoms";
import { Input } from "@/app/_components/atoms";
import { searchUsers } from "@/server/queries/user/searchUsers.query";
import {
  sendFriendRequestAction,
  respondFriendRequestAction,
} from "@/server/actions/friendship/sendRequest.action";

type UserResult = { id: string; name: string | null; username: string | null; image: string | null };
type IncomingRequest = { requester_id: string; requester: UserResult };
type OutgoingRequest = { addressee_id: string; addressee: UserResult };

type AddFriendViewProps = {
  incoming: IncomingRequest[];
  outgoing: OutgoingRequest[];
};

export function AddFriendView({ incoming, outgoing }: AddFriendViewProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserResult[]>([]);
  const [isPending, startTransition] = useTransition();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const users = await searchUsers(query, "");
      setResults(users);
    });
  }

  return (
    <div className="space-y-8">
      {/* Search */}
      <section className="space-y-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1">
            <Input
              id="search-users"
              placeholder="Search by @username or name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button type="submit" isLoading={isPending}>
            Search
          </Button>
        </form>

        {results.length > 0 && (
          <ul className="space-y-2">
            {results.map((user) => (
              <UserRow key={user.id} user={user} action="add" />
            ))}
          </ul>
        )}
      </section>

      {/* Incoming Requests */}
      {incoming.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-semibold">Incoming Requests ({incoming.length})</h2>
          <ul className="space-y-2">
            {incoming.map((req) => (
              <UserRow
                key={req.requester_id}
                user={req.requester}
                action="respond"
              />
            ))}
          </ul>
        </section>
      )}

      {/* Outgoing Requests */}
      {outgoing.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-semibold">Sent Requests ({outgoing.length})</h2>
          <ul className="space-y-2">
            {outgoing.map((req) => (
              <li key={req.addressee_id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted" />
                  <div>
                    <p className="font-medium">{req.addressee.name}</p>
                    {req.addressee.username && (
                      <p className="text-sm text-muted-foreground">@{req.addressee.username}</p>
                    )}
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">Pending</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function UserRow({ user, action }: { user: UserResult; action: "add" | "respond" }) {
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleAdd() {
    startTransition(async () => {
      await sendFriendRequestAction(user.id);
      setDone(true);
    });
  }

  function handleRespond(response: "accept" | "reject") {
    startTransition(async () => {
      await respondFriendRequestAction(user.id, response);
      setDone(true);
    });
  }

  return (
    <li className="flex items-center justify-between rounded-lg border p-3">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-muted" />
        <div>
          <p className="font-medium">{user.name}</p>
          {user.username && (
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          )}
        </div>
      </div>
      {done ? (
        <span className="text-sm text-muted-foreground">Done</span>
      ) : action === "add" ? (
        <Button size="sm" onClick={handleAdd} isLoading={isPending}>
          Add
        </Button>
      ) : (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => handleRespond("accept")} isLoading={isPending}>
            Accept
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handleRespond("reject")} isLoading={isPending}>
            Reject
          </Button>
        </div>
      )}
    </li>
  );
}
