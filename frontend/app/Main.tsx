"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Image from "next/image";
import { fetchEntries, createEntry, updateEntry, deleteEntry } from "./api";

interface Entry {
  id: number;
  image: string;
  name: string;
  position: string;
}

export default function Main() {
  const [entries, setEntries] = useState<Entry[]>([]);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentEntry, setCurrentEntry] = useState<Entry | null>(null);
  const [image, setImage] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [position, setPosition] = useState<string>("");

  const fetchData = async () => {
    const response = await fetchEntries();
    setEntries(response);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const entryData = { image, name, position };

    try {
      if (isEditing && currentEntry) {
        await updateEntry(currentEntry.id, entryData);
        setIsEditing(false);
        setCurrentEntry(null);
      } else {
        await createEntry(entryData);
      }
      await fetchData();
    } catch (error) {
      console.error(error);
    }
    setImage("");
    setName("");
    setPosition("");
  };

  const handleEdit = (entry: Entry) => {
    setIsEditing(true);
    setCurrentEntry(entry);
    setImage(entry.image);
    setName(entry.name);
    setPosition(entry.position);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEntry(id);
      await fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">CRUD Card</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? "Edit Entry" : "Create Entry"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="image" className="mb-1">
                    Image URL
                  </Label>
                  <Input
                    id="image"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name" className="mb-1">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="position" className="mb-1">
                    Position
                  </Label>
                  <Input
                    id="position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button type="submit">
                  {isEditing ? "Save Changes" : "Create Entry"}
                </Button>
                {isEditing && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setCurrentEntry(null);
                      setImage("");
                      setName("");
                      setPosition("");
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <Image
                        src={
                          entry.image?.startsWith("http")
                            ? entry.image
                            : "/globe.svg"
                        }
                        alt={entry.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                        unoptimized
                      />
                    </TableCell>
                    <TableCell>{entry.name}</TableCell>
                    <TableCell>{entry.position}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(entry)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(entry.id)}
                          disabled={isEditing}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
