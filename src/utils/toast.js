import { css } from ".";
import { navigate } from "../router";

const styles = document.createElement("style");
styles.textContent = css`
  .toast-success {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
    color: #ffffff !important;
    border-radius: 10px !important;
    box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4) !important;
    font-weight: 500;
    padding: 16px 24px !important;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    gap: 16px !important;
    min-width: 300px !important;
  }

  /* Toast Error */
  .toast-error {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
    color: #ffffff !important;
    border-radius: 10px !important;
    box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4) !important;
    font-weight: 500;
    padding: 16px 24px !important;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    gap: 16px !important;
    min-width: 300px !important;
  }

  /* Toast Info (للرسائل مع links) */
  .toast-info {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
    color: #ffffff !important;
    border-radius: 10px !important;
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4) !important;
    font-weight: 500;
    padding: 16px 24px !important;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
    min-width: 300px !important;
  }

  /* Animation من فوق */
  .toastify.on {
    animation: toast-in-top 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes toast-in-top {
    from {
      transform: translateY(-100px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  /* Icons */
  .toast-success::before {
    content: "✓";
    display: inline-block;
    font-size: 18px;
    font-weight: bold;
    flex-shrink: 0;
  }

  .toast-error::before {
    content: "✕";
    display: inline-block;
    font-size: 18px;
    font-weight: bold;
    flex-shrink: 0;
  }

  .toast-info::before {
    display: inline-block;
    margin-right: 10px;
    font-size: 18px;
    font-weight: bold;
  }

  /* Content container */
  .toast-content {
    flex: 1;
    padding: 0 8px;
  }

  /* Custom toast content wrapper */
  .toast-custom-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .toast-custom-message {
    font-size: 15px;
    line-height: 1.4;
  }

  .toast-custom-actions {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
    align-items: center;
  }

  /* Link style dans toast */
  .toast-link {
    color: #ffffff;
    text-decoration: none;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    padding: 6px 14px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    font-size: 14px;
    display: inline-block;
  }

  .toast-link:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  /* Close button */
  .toast-close {
    background: rgba(255, 255, 255, 0.15);
    border: none;
    color: #ffffff;
    font-size: 18px;
    cursor: pointer;
    padding: 0;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: all 0.2s;
    flex-shrink: 0;
    font-weight: bold;
  }

  .toast-close:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.1);
  }

  /* Hide default close button */
  .toastify-close {
    display: none !important;
  }

  /* Confirmation buttons */
  .toast-buttons {
    display: flex;
    gap: 10px;
    margin-top: 12px;
  }

  .toast-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
    transition: all 0.2s;
  }
`;
document.head.appendChild(styles);

const toast = {
  /**
   * Toast Success
   */
  success: (message, duration = 3000) => {
    Toastify({
      text: message,
      duration: duration,
      gravity: "top",
      position: "right",
      className: "toast-success",
      stopOnFocus: true,
      close: true,
    }).showToast();
  },

  /**
   * Toast Error
   */
  error: (message, duration = 3000) => {
    Toastify({
      text: message,
      duration: duration,
      gravity: "top",
      position: "right",
      className: "toast-error",
      stopOnFocus: true,
      close: true,
    }).showToast();
  },

  /**
   * Toast avec Link
   * @param {string} message - Le message à afficher
   * @param {string} linkText - Texte du lien
   * @param {string} linkUrl - URL vers laquelle naviguer
   * @param {number} duration - Durée d'affichage (défaut: 5000ms)
   */
  withLink: (message, linkText, linkUrl, duration = 5000) => {
    const container = document.createElement("div");
    container.innerHTML = `
      <div class="toast-custom-content">
        <div class="toast-custom-message"> ✓ ${message}</div>
        <div class="toast-custom-actions">
          <a href="${linkUrl}" data-link class="toast-link" id="toast-link-btn">${linkText}</a>
        </div>
      </div>
    `;

    const toastInstance = Toastify({
      node: container,
      duration: duration,
      gravity: "top",
      position: "right",
      className: "toast-info",
      stopOnFocus: true,
      escapeMarkup: false,
      close: true,
    }).showToast();

    setTimeout(() => {
      const linkBtn = document.getElementById("toast-link-btn");
      if (linkBtn) {
        linkBtn.addEventListener("click", (e) => {
          e.preventDefault();
          toastInstance.hideToast();
          navigate(linkUrl);
        });
      }
    }, 100);
  },
};

export default toast;
