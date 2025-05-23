import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AboutUs from "../pages/AboutUs.js";
import annotationsStore from "../stores/annotationsStore";
import Login from "../pages/Login.js";
import Resources from "../pages/Resources.js";
import Map from "../pages/Map";
import Layout from "./Layout.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <div style={{ height: "100vh", width: "100%" }}>
            <Map />
          </div>
        ),
      },
      {
        path: "signin",
        element: <Login />,
      },
      /*{
        path: "map",
        element: (
          <div style={{ height: "100%" }}>
            <Map />
          </div>
        ),
      },*/
      {
        path: "resources",
        element: <Resources />,
      },
      {
        path: "aboutus",
        element: <AboutUs />,
      },
      {
        path: "annotations",
        //element: <AnnotationsPage />,
      },
    ],
  },
]);

function App() {
  const store = annotationsStore();

  return <RouterProvider router={router} />;
}

export default App;
