import { createFileRoute } from "@tanstack/react-router";
import { trpc } from "../trpc";
import { CreateFeedbackForm } from "../components/CreateFeedbackForm";
import { FeedbackCard } from "../components/FeedbackCard";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const feedbackList = trpc.feedback.list.useQuery();

  if (feedbackList.isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (feedbackList.error) {
    return (
      <div className="p-8 text-center text-red-600">
        Error loading feedback: {feedbackList.error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <CreateFeedbackForm />

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
            Latest Feedback
          </h2>
          {feedbackList.data?.map((feedback) => (
            <FeedbackCard key={feedback.id} feedback={feedback} />
          ))}
          {feedbackList.data?.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No feedback yet. Be the first to share some feedback!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
