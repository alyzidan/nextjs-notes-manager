"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import PocketBase from "pocketbase";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Define validation schema with Zod
const noteSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title can't exceed 50 characters"),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .max(500, "Content can't exceed 500 characters"),
});

type NoteFormData = z.infer<typeof noteSchema>;

export default function CreateNote() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
  });

  const onSubmit = async (data: NoteFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const pb = new PocketBase("http://127.0.0.1:8090");
      await pb.collection("notes").create({
        title: data.title,
        content: data.content,
      });

      setSubmitSuccess(true);
      reset();
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      console.error("Error creating note:", err);
      setSubmitError(
        (err as Error).message || "Failed to create note. Please try again."
      );
    } finally {
      setIsSubmitting(false);
      router.refresh();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Note</h2>

      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
          Note created successfully!
        </div>
      )}

      {submitError && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            {...register("title")}
            className={`w-full px-4 py-2 border rounded-lg focus:ring focus:ring-opacity-50 text-black ${
              errors.title
                ? "border-red-300 focus:ring-red-200 focus:border-red-500"
                : "border-gray-300 focus:ring-indigo-200 focus:border-indigo-500"
            }`}
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Content
          </label>
          <textarea
            id="content"
            rows={4}
            {...register("content")}
            className={`text-black w-full px-4 py-2 border rounded-lg focus:ring focus:ring-opacity-50 ${
              errors.content
                ? "border-red-300 focus:ring-red-200 focus:border-red-500"
                : "border-gray-300 focus:ring-indigo-200 focus:border-indigo-500"
            }`}
            disabled={isSubmitting}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">
              {errors.content.message}
            </p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white shadow-md transition ${
              isSubmitting
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating...
              </span>
            ) : (
              "Create Note"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
