import React from "react";
import { useRoutes, BrowserRouter } from 'react-router-dom'
import { UserProvider } from "./context/UserContext";
import { LoginRegister } from "../Pages/LoginRegister/LoginRegister";
import { ResetPass } from "../Pages/ResetPass/ResetPass";
import { UploadVideo } from "../Pages/UploadVideo/UploadVideo";
import { VideoPlayer } from "../Pages/VideoPlayer/VideoPlayer";
import { MainPage } from "..//Pages/MainPage/MainPage";

import './App.css';

function AppRoutes() {
  const routes = useRoutes([
    { path: '/', element: <LoginRegister /> },
    { path: '/login', element: <LoginRegister /> },
    { path: '/resetpass', element: <ResetPass /> },
    { path: '/main-page', element: <MainPage /> },
    { path: '/upload-video', element: <UploadVideo /> },
    { path: '/video-player', element: <VideoPlayer /> },
    { path: '/*', element: '' },
  ])
  return routes;
}

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </BrowserRouter>
  );
}

export default App
