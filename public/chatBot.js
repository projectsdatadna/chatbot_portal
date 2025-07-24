(function () {
  const script = document.currentScript;

  const config = {
    customerId: script.dataset.customerId || "default",
    themeColor: script.dataset.themeColor || "#0066ff",
    logoUrl: script.dataset.logoUrl || "",
    position: script.dataset.position || "bottom-right",
  };

  const position = config.position;

  const chatButton = document.createElement("div");
  chatButton.style.position = "fixed";
  chatButton.style.width = "50px";
  chatButton.style.height = "50px";
  chatButton.style.padding = "10px";
  chatButton.style.borderRadius = "50%";
  chatButton.style.cursor = "pointer";
  chatButton.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
  chatButton.style.zIndex = "9998";
  chatButton.style.overflow = "hidden";
  chatButton.style.backgroundColor = config.themeColor;
  setPosition(chatButton, position);

  const img = document.createElement("img");
  img.src = "https://brave-water-027a5041e.2.azurestaticapps.net/messenger.png";
  img.alt = "Chat";
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "cover";
  chatButton.appendChild(img);

  document.body.appendChild(chatButton);

  const iframe = document.createElement("iframe");
  const params = new URLSearchParams({
    customerId: config.customerId,
    themeColor: config.themeColor,
    logoUrl: config.logoUrl,
  });

  iframe.src = `https://brave-water-027a5041e.2.azurestaticapps.net/?${params.toString()}`;
  iframe.style.position = "fixed";
  iframe.style.width = "320px";
  iframe.style.height = "600px";
  iframe.style.border = "none";
  iframe.style.borderRadius = "10px";
  iframe.style.boxShadow = "0 0 20px rgba(0,0,0,0.3)";
  iframe.style.zIndex = "9999";
  iframe.style.display = "none";
  iframe.setAttribute("id", "chatbot-iframe");
  setPosition(iframe, position, 90);

  document.body.appendChild(iframe);

  let isOpen = false;
  chatButton.addEventListener("click", function (e) {
    e.stopPropagation();
    isOpen = !isOpen;
    iframe.style.display = isOpen ? "block" : "none";
  });

  document.addEventListener("click", function (event) {
    if (
      !chatButton.contains(event.target) &&
      !iframe.contains(event.target)
    ) {
      iframe.style.display = "none";
      isOpen = false;
    }
  });

  function setPosition(element, position, offset = 20) {
    element.style.top = "";
    element.style.bottom = "";
    element.style.left = "";
    element.style.right = "";

    switch (position) {
      case "top-left":
        element.style.top = `${offset}px`;
        element.style.left = `${offset}px`;
        break;
      case "top-right":
        element.style.top = `${offset}px`;
        element.style.right = `${offset}px`;
        break;
      case "bottom-left":
        element.style.bottom = `${offset}px`;
        element.style.left = `${offset}px`;
        break;
      case "bottom-right":
      default:
        element.style.bottom = `${offset}px`;
        element.style.right = `${offset}px`;
        break;
    }
  }
})();
