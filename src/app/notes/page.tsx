import Link from "next/link";
import PocketBase from "pocketbase";
import CreateNote from "./[id]/CreateNote";

interface INote {
  id: string;
  title: string;
  content: string;
  created: string;
}
export const dynamic = "auto",
  dynamicParams = true,
  revalidate = 0,
  fetchCache = "auto",
  runtime = "nodejs";

async function getNotes(): Promise<INote[]> {
  const db = new PocketBase("http://127.0.0.1:8090");
  const data = await db.collection("notes").getList(1, 30, {
    sort: "-id",
  });

  return (data.items as unknown as INote[]) || [];
}
export default async function NotesPage() {
  const notes = (await getNotes()) || [];
  return (
    <div className="container mx-auto ">
      <div className="flex flex-wrap items-center justify-center w-full gap-2 mb-2">
        {notes.map((note) => (
          <Note key={note.id} note={note} />
        ))}
        {notes.length === 0 && "No notes"}
      </div>
      <CreateNote />
    </div>
  );
}
function Note({ note }: any) {
  const { id, title, content, created } = note || {};
  return (
    <div
      className="flex note note--yellow
    w-[20%] h-64
    px-4 py-2
    text-black
    bg-gradient-to-b from-yellow-200 to-yellow-300
    shadow-md rounded-none
    border-t border-yellow-300"
    >
      <Link href={`/notes/${id}`}>
        <h1>{title}</h1>
        <p>{content}</p>
      </Link>
    </div>
  );
}
