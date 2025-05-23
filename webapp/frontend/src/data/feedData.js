import {
  flood1,
  flood2,
  flood3,
  flood4,
  flood5,
  flood6,
  flood7,
} from "./profileImg/images";

// Dummy Data with unique annotationId for each post
const initialFeedData = [
  {
    annotationId: "1", // Unique annotationId
    title: "Basement Flooding at East Chatham",
    address: "1234 S Cottage Grove Ave",
    numUpvotes: 15,
    profileImg: flood1,
    images: [flood4, flood5],
    timestamp: "12/7/2024, 10:30:49 PM",
  },
  {
    annotationId: "2", // Unique annotationId
    title: "Flooding at Garden Homes",
    address: "1234 E 63rd St.",
    numUpvotes: 3,
    profileImg: flood2,
    images: [flood6, flood7],
    timestamp: "12/7/2024, 10:50:49 PM",
  },
  {
    annotationId: "3", // Unique annotationId
    title: "Sewage Cleaning Overdue at West Chesterfield",
    address: "1234 S Cottage Grove Ave",
    numUpvotes: 4,
    profileImg: flood3,
    images: [flood4, flood5],
    timestamp: "11/28/2024, 11:10:20 AM",
  },
  {
    annotationId: "4", // Unique annotationId
    title: "Flooding at Garden Homes",
    address: "1234 S Cottage Grove Ave",
    numUpvotes: 6,
    profileImg: flood4,
    images: [flood6, flood7],
    timestamp: "12/5/2024, 10:30:49 AM",
  },
];

export default initialFeedData;
