// CommunityFeed.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Button,
  TextField,
  Typography,
  IconButton,
  Avatar,
  Collapse,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import CommentIcon from "@mui/icons-material/Comment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export default function CommunityFeed() {
  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  const token = localStorage.getItem("token");

  // GET CURRENT USER
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  // FETCH POSTS
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("https://mern-7-2gn5.onrender.com/api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const postsData = await res.json();
      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // CREATE POST
  const handleAddPost = async () => {
    if (!newPostText.trim() && !newPostImage) return;

    try {
      const formData = new FormData();
      formData.append("text", newPostText);
      if (newPostImage) formData.append("image", newPostImage);

      const res = await fetch("https://mern-7-2gn5.onrender.com/api/posts/create", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to create post");

      const post = await res.json();
      setPosts([post, ...posts]);
      setNewPostText("");
      setNewPostImage(null);
      document.getElementById("uploadImage").value = "";
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  // LIKE/UNLIKE POST
  const handleLike = async (postId) => {
    try {
      const res = await fetch(`https://mern-7-2gn5.onrender.com/api/posts/${postId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      
      // Update the specific post's likes array
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId 
            ? { ...post, likes: result.likes } 
            : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // CHECK IF CURRENT USER LIKED THE POST
  const isPostLiked = (post) => {
    if (!currentUser || !post.likes) return false;
    return post.likes.includes(currentUser.id);
  };

  // TOGGLE COMMENTS VISIBILITY
  const toggleComments = async (postId, index) => {
    const isExpanded = expandedComments[postId];
    
    if (!isExpanded && !posts[index].comments) {
      // Fetch comments if not already loaded
      await fetchComments(postId, index);
    }
    
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !isExpanded
    }));
  };

  // ADD COMMENT
  const handleAddComment = async (postId, index) => {
    const text = commentInputs[index] || "";
    if (!text.trim()) return;

    try {
      const res = await fetch(`https://mern-7-2gn5.onrender.com/api/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: text }),
      });

      const newComment = await res.json();
      
      // Fetch updated comments for this post
      const commentsRes = await fetch(`https://mern-7-2gn5.onrender.com/api/posts/${postId}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedComments = await commentsRes.json();

      // Update the post with new comments and keep comments expanded
      setPosts(prevPosts => 
        prevPosts.map((post, i) => 
          i === index 
            ? { ...post, comments: updatedComments } 
            : post
        )
      );

      // Ensure comments stay expanded after adding new comment
      setExpandedComments(prev => ({
        ...prev,
        [postId]: true
      }));

      // Clear the comment input
      setCommentInputs({ ...commentInputs, [index]: "" });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // FETCH COMMENTS FOR A POST
  const fetchComments = async (postId, index) => {
    try {
      const res = await fetch(`https://mern-7-2gn5.onrender.com/api/posts/${postId}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const comments = await res.json();
      
      setPosts(prevPosts => 
        prevPosts.map((post, i) => 
          i === index 
            ? { ...post, comments } 
            : post
        )
      );
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  return (
    <Box sx={{ mt: 6, maxWidth: 800, margin: "0 auto", p: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1E3A8A", mb: 2 }}>
        Community Discussions
      </Typography>

      {/* CREATE POST CARD */}
      <Card sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Share something with the community..."
          value={newPostText}
          onChange={(e) => setNewPostText(e.target.value)}
          variant="outlined"
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <input
              type="file"
              accept="image/*"
              id="uploadImage"
              style={{ display: "none" }}
              onChange={(e) => setNewPostImage(e.target.files[0])}
            />
            <label htmlFor="uploadImage">
              <Button 
                component="span" 
                variant="outlined" 
                startIcon={<AddIcon />}
                sx={{ borderRadius: 2 }}
              >
                Add Image
              </Button>
            </label>
            {newPostImage && (
              <Typography variant="body2" color="text.secondary">
                {newPostImage.name}
              </Typography>
            )}
          </Box>

          <Button 
            variant="contained" 
            onClick={handleAddPost}
            disabled={!newPostText.trim() && !newPostImage}
            sx={{ 
              bgcolor: "#1E3A8A",
              "&:hover": { bgcolor: "#152C6B" },
              borderRadius: 2,
              px: 3
            }}
          >
            Post
          </Button>
        </Box>
      </Card>

      {/* POSTS FEED */}
      {posts.map((post, index) => (
        <Card 
          key={post._id} 
          sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: 2, 
            boxShadow: 2,
            border: "1px solid #e0e0e0"
          }}
        >
          {/* POST HEADER */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar 
              sx={{ 
                mr: 2, 
                bgcolor: "#1E3A8A",
                width: 40, 
                height: 40 
              }}
            >
              {post.userId?.name?.charAt(0)?.toUpperCase() || "U"}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                {post.userId?.name || "User"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(post.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>

          {/* POST CONTENT */}
          <Typography sx={{ mb: 2, fontSize: "1.1rem", lineHeight: 1.5 }}>
            {post.text}
          </Typography>

          {/* POST IMAGE */}
          {post.image && (
            <Box sx={{ mb: 2 }}>
              <img
                src={post.image}
                alt="post"
                style={{
                  width: "100%",
                  maxHeight: "400px",
                  borderRadius: 12,
                  objectFit: "cover",
                }}
              />
            </Box>
          )}

          {/* POST ACTIONS */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Button
              startIcon={isPostLiked(post) ? <ThumbUpIcon /> : <ThumbUpOffAltIcon />}
              onClick={() => handleLike(post._id)}
              sx={{ 
                color: isPostLiked(post) ? "#1E3A8A" : "text.secondary",
                fontWeight: isPostLiked(post) ? "bold" : "normal",
                "&:hover": {
                  color: "#1E3A8A",
                  backgroundColor: "rgba(30, 58, 138, 0.1)"
                }
              }}
            >
              {post.likes?.length || 0} {post.likes?.length === 1 ? 'Like' : 'Likes'}
            </Button>
            
            {/* Comments Toggle Button */}
            <Button
              startIcon={expandedComments[post._id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              onClick={() => toggleComments(post._id, index)}
              sx={{ 
                color: "text.secondary",
                "&:hover": {
                  color: "#1E3A8A",
                  backgroundColor: "rgba(30, 58, 138, 0.1)"
                }
              }}
            >
              Comments {post.comments ? `(${post.comments.length})` : ''}
            </Button>
          </Box>

          {/* ADD COMMENT - Always visible */}
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Write a comment..."
              value={commentInputs[index] || ""}
              onChange={(e) =>
                setCommentInputs({ ...commentInputs, [index]: e.target.value })
              }
              variant="outlined"
              sx={{ 
                "& .MuiOutlinedInput-root": { 
                  borderRadius: 2 
                } 
              }}
            />
            <Button 
              onClick={() => handleAddComment(post._id, index)}
              variant="contained"
              sx={{ 
                bgcolor: "#1E3A8A",
                "&:hover": { bgcolor: "#152C6B" },
                borderRadius: 2,
                minWidth: "auto",
                px: 2
              }}
            >
              <CommentIcon />
            </Button>
          </Box>

          {/* COMMENTS LIST - Collapsible */}
          <Collapse in={expandedComments[post._id]}>
            {post.comments && post.comments.length > 0 ? (
              <Box sx={{ borderTop: 1, borderColor: "divider", pt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
                  Comments ({post.comments.length}):
                </Typography>
                {post.comments.map((comment) => (
                  <Box 
                    key={comment._id} 
                    sx={{ 
                      mb: 1, 
                      p: 1.5, 
                      bgcolor: "grey.50", 
                      borderRadius: 2 
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                      <Avatar 
                        sx={{ 
                          width: 24, 
                          height: 24, 
                          mr: 1,
                          fontSize: "0.8rem",
                          bgcolor: "#1E3A8A"
                        }}
                      >
                        {comment.userId?.name?.charAt(0)?.toUpperCase() || "U"}
                      </Avatar>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                        {comment.userId?.name || "User"}
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      {comment.comment}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : post.comments && post.comments.length === 0 ? (
              <Box sx={{ borderTop: 1, borderColor: "divider", pt: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No comments yet. Be the first to comment!
                </Typography>
              </Box>
            ) : null}
          </Collapse>
        </Card>
      ))}
    </Box>
  );
}