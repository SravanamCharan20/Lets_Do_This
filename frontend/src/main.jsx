import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from "react-router";
import Document from './pages/Document.jsx';
import ShowDoc from './pages/ShowDoc.jsx';
import SearchDocs from './pages/SearchDocs.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        path: "/document",
        element: (
            <Document />
        ),
      },
      {
        path: "/show-docs",
        element: (
            <ShowDoc />
        ),
      },
      {
        path: "/search-docs",
        element: (
            <SearchDocs />
        ),
      },
      
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
