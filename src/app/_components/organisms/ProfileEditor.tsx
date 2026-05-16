"use client";

import { useState } from "react";
import { Button } from "@/app/_components/atoms";
import { Input } from "@/app/_components/atoms";
import { updateProfileAction } from "@/server/actions/user/updateProfile.action";

type ProfileEditorProps = {
  initialName: string;
  initialUsername: string;
  email: string;
};

export function ProfileEditor({ initialName, initialUsername, email }: ProfileEditorProps) {
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
    <div className="space-y-4 rounded-lg border p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-muted" />
          <div>
            {!editing ? (
              <>
                <h1 className="text-xl font-bold">{name || "No name set"}</h1>
                <p className="text-muted-foreground">
                  {username ? `@${username}` : email}
                </p>
              </>
            ) : null}
          </div>
        </div>
        {!editing && (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            Edit
          </Button>
        )}
      </div>

      {editing && (
        <div className="space-y-3">
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
            <Button onClick={handleSave} isLoading={isLoading}>
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
