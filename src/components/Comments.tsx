import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface CommentsProps {
  recipeId: string;
}

export function Comments({ recipeId }: CommentsProps) {
  const comments = useQuery(api.comments.getComments, { recipeId: recipeId as any });
  const addComment = useMutation(api.comments.addComment);
  const currentUser = useQuery(api.auth.loggedInUser);

  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await addComment({
        recipeId: recipeId as any,
        content: newComment.trim(),
      });
      setNewComment("");
      toast.success("Comment added!");
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-container shadow-lg p-6">
      <h3 className="text-2xl font-bold text-primary mb-6">Comments</h3>

      {/* Add Comment Form */}
      {currentUser && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex space-x-3">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-sm font-semibold text-primary">
              {(currentUser.profile?.username || currentUser.name || "U")[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-container border border-accent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                placeholder="Share your thoughts about this recipe..."
                disabled={isSubmitting}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  className="px-4 py-2 bg-primary text-white font-semibold rounded-container hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Comments List */}
      {comments === undefined ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-text/70">No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="flex space-x-3">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-sm font-semibold text-primary">
                {comment.author?.profile?.username?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="bg-secondary/30 rounded-container p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-semibold text-text">
                      {comment.author?.profile?.username}
                    </span>
                    <span className="text-text/50 text-sm">
                      {new Date(comment._creationTime).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-text">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
