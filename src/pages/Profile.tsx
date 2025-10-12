import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { RecipeCard } from "../components/RecipeCard";
import { toast } from "sonner";

export function Profile() {
  const { userId } = useParams<{ userId: string }>();
  const userProfile = useQuery(api.users.getUserProfile, { userId: userId as any });
  const currentUser = useQuery(api.auth.loggedInUser);
  const followUser = useMutation(api.users.followUser);

  const handleFollow = async () => {
    if (!userId) return;
    
    try {
      const isFollowing = await followUser({ userId: userId as any });
      toast.success(isFollowing ? "Following user!" : "Unfollowed user");
    } catch (error) {
      toast.error("Failed to update follow status");
    }
  };

  if (userProfile === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-text">User not found</h1>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === userId;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-container shadow-lg p-6 mb-8">
        <div className="flex items-start space-x-6">
          <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center text-3xl font-bold text-primary">
            {userProfile.profile?.avatarUrl ? (
              <img
                src={userProfile.profile.avatarUrl}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              userProfile.profile?.username?.[0]?.toUpperCase()
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-primary">
                {userProfile.profile?.username}
              </h1>
              {!isOwnProfile && currentUser && (
                <button
                  onClick={handleFollow}
                  className="px-6 py-2 bg-primary text-white font-semibold rounded-container hover:bg-primary-hover transition-colors"
                >
                  Follow
                </button>
              )}
            </div>

            <div className="flex items-center space-x-6 text-text/70 mb-4">
              <span>{userProfile.recipes.length} recipes</span>
              <span>{userProfile.followerCount} followers</span>
              <span>{userProfile.followingCount} following</span>
            </div>

            {userProfile.profile?.bio && (
              <p className="text-text">{userProfile.profile.bio}</p>
            )}
          </div>
        </div>
      </div>

      {/* User's Recipes */}
      <div>
        <h2 className="text-2xl font-bold text-primary mb-6">
          {isOwnProfile ? "Your Recipes" : `${userProfile.profile?.username}'s Recipes`}
        </h2>

        {userProfile.recipes.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-text mb-2">No recipes yet</h3>
            <p className="text-text/70">
              {isOwnProfile ? "Start sharing your favorite recipes!" : "This user hasn't shared any recipes yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userProfile.recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
