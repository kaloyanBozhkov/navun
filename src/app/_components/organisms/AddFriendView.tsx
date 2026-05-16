"use client";

import { useState, useTransition } from "react";
import { Input } from "@/app/_components/atoms";
import { searchUsersAction } from "@/server/actions/user/searchUsers.action";
import {
  sendFriendRequestAction,
  respondFriendRequestAction,
} from "@/server/actions/friendship/sendRequest.action";
import { Search } from "lucide-react";
import Image from "next/image";

type UserResult = { id: string; name: string | null; username: string | null; image: string | null };
type IncomingRequest = { requester_id: string; requester: UserResult };
type OutgoingRequest = { addressee_id: string; addressee: UserResult };

type AddFriendViewProps = {
  incoming: IncomingRequest[];
  outgoing: OutgoingRequest[];
  suggested: UserResult[];
};

export function AddFriendView({ incoming, outgoing, suggested }: AddFriendViewProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    startTransition(async () => {
      const users = await searchUsers(query, "");
      setResults(users);
      setHasSearched(true);
    });
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    if (!e.target.value.trim()) {
      setResults([]);
      setHasSearched(false);
    }
  }

  const outgoingIds = new Set(outgoing.map((r) => r.addressee_id));

  return (
    <div className="space-y-6">
      {/* Search */}
      <section className="space-y-2">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            placeholder="Търси по @потребителско име"
            value={query}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </form>
        <p className="text-sm text-muted-foreground">
          Въведи @тага на приятеля си, за да го намериш
        </p>
      </section>

      {/* Search Results */}
      {hasSearched && (
        <section className="space-y-3">
          {results.length > 0 ? (
            <ul className="space-y-2">
              {results.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  action={outgoingIds.has(user.id) ? "sent" : "add"}
                />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Няма намерени резултати
            </p>
          )}
        </section>
      )}

      {/* Suggestions */}
      {!hasSearched && suggested.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Предложения
          </h2>
          <ul className="space-y-2">
            {suggested.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                action={outgoingIds.has(user.id) ? "sent" : "add"}
              />
            ))}
          </ul>
        </section>
      )}

      {/* Incoming Requests */}
      {incoming.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Заявки за приятелство ({incoming.length})
          </h2>
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
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Изпратени заявки ({outgoing.length})
          </h2>
          <ul className="space-y-2">
            {outgoing.map((req) => (
              <UserRow
                key={req.addressee_id}
                user={req.addressee}
                action="sent"
              />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function UserRow({ user, action }: { user: UserResult; action: "add" | "respond" | "sent" }) {
  const [currentAction, setCurrentAction] = useState(action);
  const [isPending, startTransition] = useTransition();

  function handleAdd() {
    startTransition(async () => {
      await sendFriendRequestAction(user.id);
      setCurrentAction("sent");
    });
  }

  function handleRespond(response: "accept" | "reject") {
    startTransition(async () => {
      await respondFriendRequestAction(user.id, response);
      setCurrentAction("sent");
    });
  }

  return (
    <li className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
      <div className="flex items-center gap-3">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name ?? ""}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
            {user.name?.[0]?.toUpperCase() ?? "?"}
          </div>
        )}
        <div>
          <p className="text-sm font-medium">{user.name}</p>
          {user.username && (
            <p className="text-xs text-muted-foreground">@{user.username}</p>
          )}
        </div>
      </div>

      {currentAction === "sent" ? (
        <span className="rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground">
          Изпратено
        </span>
      ) : currentAction === "add" ? (
        <button
          onClick={handleAdd}
          disabled={isPending}
          className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50"
        >
          Добави
        </button>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => handleRespond("accept")}
            disabled={isPending}
            className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50"
          >
            Приеми
          </button>
          <button
            onClick={() => handleRespond("reject")}
            disabled={isPending}
            className="rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground disabled:opacity-50"
          >
            Откажи
          </button>
        </div>
      )}
    </li>
  );
}
