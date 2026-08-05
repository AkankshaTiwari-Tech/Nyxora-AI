import {
  useState,
} from "react";

import AppRoutes
  from "./routes/AppRoutes";

import SplashScreen
  from "./components/splash/SplashScreen";


export default function App() {

  // ====================================================
  // SHOW INTRO ONLY ONCE PER BROWSER TAB / SESSION
  // ====================================================

  const [
    showSplash,
    setShowSplash,
  ] = useState(() => {

    const hasPlayed =
      sessionStorage.getItem(
        "nyxora_intro_played"
      );

    return !hasPlayed;

  });


  // ====================================================
  // INTRO COMPLETE
  // ====================================================

  const handleSplashComplete = () => {

    sessionStorage.setItem(
      "nyxora_intro_played",
      "true"
    );

    setShowSplash(false);

  };


  // ====================================================
  // RENDER
  // ====================================================

  return (

    <>

      <AppRoutes />


      {
        showSplash && (

          <SplashScreen
            mode="intro"
            onComplete={
              handleSplashComplete
            }
          />

        )
      }

    </>

  );

}