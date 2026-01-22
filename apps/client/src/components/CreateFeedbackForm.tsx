import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFeedbackSchema, CreateFeedbackInput } from "@repo/shared";
import { trpc } from "../trpc";

export function CreateFeedbackForm() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    trigger,
    formState: { errors, isSubmitting, submitCount },
  } = useForm<CreateFeedbackInput>({
    resolver: zodResolver(createFeedbackSchema),
    defaultValues: { title: "", description: "" },
    resetOptions: { keepValues: false },
  });

  const utils = trpc.useUtils();
  const createMutation = trpc.feedback.create.useMutation({
    onSuccess: () => {
      utils.feedback.list.invalidate();
      reset();
    },
  });

  useEffect(() => {
    // this is to get zodResolver working again after first submit.
    // https://github.com/react-hook-form/resolvers/issues/671
    // this causes the component to rerender after first submit and onchange
    // after that. This disables memoization from react compiler
    if (submitCount === 0) {
      return;
    }

    // eslint-disable-next-line react-hooks/incompatible-library
    const subscription = watch(() => trigger());
    return () => subscription.unsubscribe();
  }, [watch, trigger, submitCount]);

  const onSubmit: SubmitHandler<CreateFeedbackInput> = (data) => {
    console.log(data);
    createMutation.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mb-8"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Give Feedback</h2>

      <div className="mb-4">
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          placeholder="Feature title or short summary"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div className="mb-6">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          {...register("description")}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          placeholder="Explain your idea in detail..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || createMutation.isPending}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting || createMutation.isPending
          ? "Submitting..."
          : "Submit Feedback"}
      </button>
    </form>
  );
}
