import React, { useEffect, useRef } from "react";

const LiveScoreWidget = () => {
  const widgetRef = useRef(null);

  useEffect(() => {
    // Ensure the widget script is loaded after the component is mounted
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://ls.soccersapi.com/widget/res/w_default/widget.js";
    script.async = true;

    const divElement = document.getElementById("ls-widget");
    divElement.insertAdjacentElement("afterbegin", script);

    return () => {
      // Cleanup the script when the component unmounts
      if (widgetRef.current) {
        widgetRef.current.innerHTML = "";
      }
    };
  }, []);

  return <div id="ls-widget" data-w="w_default" ref={widgetRef}></div>;
};

export default LiveScoreWidget;
