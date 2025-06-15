const checkUserAuthentication = (user) => {
  if (!user || !user.token) {
    console.error("User is not authenticated");
    return false;
  }

  // Check if user has playlists
  if (!Array.isArray(user.playlists)) {
    user.playlists = [];
  }

  // Check if user has a valid token
  if (typeof user.token !== "string" || user.token.trim() === "") {
    console.error("Invalid user token");
    return false;
  }

  return true;
};
export default checkUserAuthentication;
