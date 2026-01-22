import { useState } from "react";
import { trpc } from "../trpc";
import { ConfirmDialog } from "./ConfirmDialog";

type FeedbackCardProps = {
  feedback: {
    id: string;
    title: string;
    description: string;
    upvotes: number;
  };
};

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const utils = trpc.useUtils();
  const upvoteMutation = trpc.feedback.upvote.useMutation({
    onSuccess: () => {
      utils.feedback.list.invalidate();
    },
  });
  const deleteMutation = trpc.feedback.delete.useMutation({
    onSuccess: () => {
      utils.feedback.list.invalidate();
    },
  });

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex justify-between items-start gap-4 transition-all hover:shadow-lg">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {feedback.title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {feedback.description}
          </p>
        </div>

        <div className="flex flex-col gap-2 items-center">
          <button
            onClick={() => upvoteMutation.mutate({ id: feedback.id })}
            disabled={upvoteMutation.isPending}
            className="flex flex-col items-center bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-2 min-w-[3rem] transition-colors"
            aria-label="Upvote"
          >
            <span className="text-xl">▲</span>
            <span className="font-bold text-gray-800">{feedback.upvotes}</span>
          </button>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={deleteMutation.isPending}
            className="text-red-400 hover:text-red-600 text-sm py-1 px-2 rounded transition-colors"
            aria-label="Delete"
          >
            Delete
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => deleteMutation.mutate({ id: feedback.id })}
        title="Delete Feedback"
        message="Are you sure you want to delete this feedback? This action cannot be undone."
      />
    </>
  );
}
