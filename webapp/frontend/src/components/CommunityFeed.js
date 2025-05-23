import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/communityFeed.css";
import axiosInstance from "../axiosInstance.js";
import { auth } from "../firebase";

// Custom Hook for Authentication State
function useAuth() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser); // Update user state on authentication change
    });

    return () => unsubscribe();
  }, []);

  const requireAuth = () => {
    if (!user) {
      navigate("/signin");
    }
    return user;
  };

  return { user, requireAuth };
}

// Custom Hook for Upvote Logic
function useUpvote() {
  const [upvoteStatus, setUpvoteStatus] = useState({});

  useEffect(() => {
    const storedUpvotes =
      JSON.parse(localStorage.getItem("upvoteStatus")) || {};
    setUpvoteStatus(storedUpvotes);
  }, []);

  const toggleUpvote = async (annotationId, user, onUpvote) => {
    if (!user) return; // Ensure the user is authenticated

    const newStatus = {
      ...upvoteStatus,
      [annotationId]: !upvoteStatus[annotationId],
    };

    localStorage.setItem("upvoteStatus", JSON.stringify(newStatus));
    setUpvoteStatus(newStatus);

    try {
      const response = await axiosInstance.patch(
        `/incidents/${annotationId}/upvote`,
        { upvote: newStatus[annotationId] }
      );

      if (response.status === 200) {
        onUpvote(annotationId, response.data.upvotes);
      }
    } catch (error) {
      console.error("Error toggling upvote:", error);
    }
  };

  return { upvoteStatus, toggleUpvote };
}

// PC Version Component
function CommunityFeedPC({
  feedData,
  onFeedHover,
  onFeedLeave,
  onFeedClicked,
  hoveredFeedId,
  onUpvote,
}) {
  const { user, requireAuth } = useAuth(); // Use custom hook for auth state
  const { upvoteStatus, toggleUpvote } = useUpvote();

  const handleUpvote = (annotationId) => {
    if (!requireAuth()) return; // Ensure the user is authenticated before proceeding
    toggleUpvote(annotationId, user, onUpvote); // Toggle upvote if authenticated
  };

  return (
    <div className="community-feed">
      <div className="container">
        <div
          className={`feed-container ${
            feedData.length > 5 ? "scrollable" : ""
          }`}>
          {feedData.map((feed) => (
            <FeedItemPC
              key={feed.annotationId}
              title={
                "" + feed.propertyType + " flooding at " + feed.floodAddress
              }
              // profileImg={feed.profileImg}
              images={feed.images}
              numUpvotes={feed.numUpvotes}
              timestamp={feed.timestamp}
              annotationId={feed.annotationId}
              onUpvote={handleUpvote}
              upvoteActive={upvoteStatus[feed.annotationId] || false}
              onClick={() => onFeedClicked(feed.annotationId)}
              onMouseEnter={() => onFeedHover(feed.annotationId)}
              onMouseLeave={onFeedLeave}
              isHovered={hoveredFeedId === feed.annotationId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FeedItemPC({
  title,
  // profileImg,
  images = [],
  numUpvotes,
  timestamp,
  annotationId,
  upvoteActive,
  onUpvote,
  onMouseEnter,
  onMouseLeave,
  onClick,
  isHovered,
}) {
  return (
    <div
      className={`feed-item ${isHovered ? "hovered" : ""}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}>
      <div className="user-info">
        <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
          {/* profileImg ? (
            <img src={profileImg} alt="profile-pic" />
          ) : (
            <div
              style={{
                width: "1.563rem",
                height: "1.563rem",
                borderRadius: "50%",
                backgroundColor: "#ccc",
              }}
            />
          )*/}
          <span className="feed-item-title">{title}</span>
        </div>
        <InteractionButton
          onClick={() => onUpvote(annotationId)}
          count={numUpvotes}
          upvoteActive={upvoteActive}
        />
      </div>
      <div className="images">
        {images.length > 0
          ? images.slice(0, 2).map((image, index) => (
              <img
                key={index}
                style={{
                  width: "45%",
                  borderRadius: ".7rem",
                  maxHeight: "8rem",
                }}
                src={image}
                alt={`flood-pic-${index}`}
              />
            ))
          : null}
      </div>
      <div className="feed-content">
        <div className="timestamp">{timestamp}</div>
      </div>
    </div>
  );
}

function InteractionButton({ onClick, count, upvoteActive }) {
  return (
    <button
      onClick={onClick}
      style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
      <svg
        width="13"
        height="14"
        viewBox="0 0 13 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M7.84164 2.30132C7.28885 1.19574 5.71115 1.19574 5.15836 2.30132L0.894426 10.8292C0.395751 11.8265 1.12099 13 2.23607 13H10.7639C11.879 13 12.6042 11.8265 12.1056 10.8292L7.84164 2.30132Z"
          stroke="#4FA14F"
          fill={upvoteActive ? "#4FA14F" : "none"}
        />
      </svg>
      <span style={{ marginLeft: ".2rem", fontSize: ".625rem" }}>{count}</span>
    </button>
  );
}

// Mobile Version Component
function CommunityFeedMobile({
  feedData,
  onFeedHover,
  onFeedLeave,
  onFeedClicked,
  hoveredFeedId,
  onUpvote,
}) {
  const { user, requireAuth } = useAuth(); // Use custom hook for auth state
  const { upvoteStatus, toggleUpvote } = useUpvote(); // Use custom hook for upvote logic

  // Handle upvote action
  const handleUpvote = (annotationId) => {
    if (!requireAuth()) return; // Ensure the user is authenticated before proceeding
    toggleUpvote(annotationId, user, onUpvote); // Toggle upvote if authenticated
  };

  return (
    <div className="community-feed">
      <div className="container">
        <div className="feed-container">
          {feedData.length === 0 ? (
            <div className="empty-feed-message">
              <p>No flooding incidents reported yet.</p>
              <p>Tap on the map to report a flooding incident.</p>
            </div>
          ) : (
            feedData.map((feed) => (
              <FeedItemMobile
                key={feed.annotationId}
                title={
                  "" + feed.propertyType + " flooding at " + feed.floodAddress
                }
                //profileImg={feed.profileImg}
                images={feed.images}
                numUpvotes={feed.numUpvotes}
                timestamp={feed.timestamp}
                annotationId={feed.annotationId}
                onUpvote={handleUpvote}
                upvoteActive={upvoteStatus[feed.annotationId] || false}
                onClick={() => {
                  onFeedClicked(feed.annotationId);
                }}
                onMouseEnter={() => onFeedHover(feed.annotationId)} // Pass annotationId
                onMouseLeave={onFeedLeave} // Use leave handler
                isHovered={hoveredFeedId === feed.annotationId} // Compare annotationId
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function FeedItemMobile({
  title,
  //profileImg,
  images = [],
  numUpvotes,
  timestamp,
  annotationId,
  upvoteActive,
  onUpvote,
  onMouseEnter,
  onMouseLeave,
  onClick,
  isHovered,
}) {
  return (
    <div
      className={`feed-item ${isHovered ? "hovered" : ""}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}>
      <div className="user-info">
        <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
          {/*profileImg ? (
            <img src={profileImg} alt="profile-pic" />
          ) : (
            <div
              style={{
                width: "1.563rem",
                height: "1.563rem",
                borderRadius: "50%",
                backgroundColor: "#ccc",
              }}
            />
          )*/}
          <span className="feed-item-title">{title}</span>
        </div>
        <InteractionButton
          onClick={() => onUpvote(annotationId)}
          count={numUpvotes}
          upvoteActive={upvoteActive}
        />
      </div>
      <div className="images">
        {/* Ensure images is always an array before calling .slice() */}
        {images.length > 0
          ? images.slice(0, 2).map((image, index) => (
              <img
                key={index}
                style={{
                  width: "45%",
                  borderRadius: ".7rem",
                  maxHeight: "8rem",
                }}
                src={image}
                alt={`flood-pic-${index}`}
              />
            ))
          : null}
      </div>
      <div className="feed-content">
        <div className="timestamp">{timestamp}</div>
      </div>
    </div>
  );
}

// Unified CommunityFeed Component
export default function CommunityFeed(props) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? (
    <CommunityFeedMobile {...props} />
  ) : (
    <CommunityFeedPC {...props} />
  );
}
