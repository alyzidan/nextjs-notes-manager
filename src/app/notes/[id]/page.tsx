import { get } from "http";
import PocketBase from "pocketbase";

async function getNote(id: string) {
  const db = new PocketBase("http://127.0.0.1:8090");
  return await db.collection("notes").getOne(id, {
    fields: "id,title,content,created", // Include id field
  });
}

export default async function NotesPage(param: any) {
  const note = await getNote(param.params.id); // Await the promise

  return (
    <div>
      <h1>Note Details</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold text-gray-800">{note.title}</h2>
          <span className="text-sm text-gray-500">
            Created: {new Date(note.created).toLocaleDateString()}
          </span>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <p className="text-gray-700 whitespace-pre-line">{note.content}</p>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <span className="text-sm font-mono text-gray-400">ID: {note.id}</span>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
            Edit Note
          </button>
        </div>
      </div>
    </div>
  );
}
