"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil } from "lucide-react";
import { Button } from "@/app/_components/atoms";
import { Input } from "@/app/_components/atoms";
import { updateProfileAction } from "@/server/actions/user/updateProfile.action";
import { getAvatarColor } from "@/utils/avatarColor";

type ProfileEditorProps = {
  userId: string;
  initialName: string;
  initialUsername: string;
  email: string;
  image: string | null;
  interestCount: number;
  friendCount: number;
  visitedCount: number;
};

export function ProfileEditor({
  userId,
  initialName,
  initialUsername,
  email,
  image,
  interestCount,
  friendCount,
  visitedCount,
}: ProfileEditorProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [username, setUsername] = useState(initialUsername);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSave() {
    setError("");
    setIsLoading(true);

    const result = await updateProfileAction({ name, username });
    if (!result.success) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    setEditing(false);
    setIsLoading(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-6">
        {/* Avatar */}
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full">
          {image ? (
            <Image
              src={image}
              alt={name || "avatar"}
              fill
              className="object-cover"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-2xl font-bold text-white"
              style={{ backgroundColor: getAvatarColor(userId) }}
            >
              {name?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}
        </div>

        {/* Name + username + edit button */}
        <div className="flex flex-1 items-start justify-between">
          <div>
            {!editing && (
              <>
                <h1 className="text-xl font-bold">{name || "No name set"}</h1>
                <p className="text-muted-foreground">
                  {username ? `@${username}` : email}
                </p>
              </>
            )}
          </div>
          {!editing && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => setEditing(true)}
            >
              <Pencil size={14} /> Редактирай
            </Button>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-6">
        <div className="text-center">
          <p className="text-lg font-bold">{interestCount}</p>
          <p className="text-xs text-muted-foreground">Интереси</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold">{friendCount}</p>
          <p className="text-xs text-muted-foreground">Приятели</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold">{visitedCount}</p>
          <p className="text-xs text-muted-foreground">Посетени</p>
        </div>
      </div>

      {/* Edit form */}
      {editing && (
        <div className="space-y-3 rounded-lg border p-6">
          <Input
            id="name"
            label="Display Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            id="username"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={error || undefined}
          />
          <div className="flex gap-2">
            <Button variant="blue" onClick={handleSave} isLoading={isLoading}>
              Save
            </Button>
            <Button variant="ghost" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
