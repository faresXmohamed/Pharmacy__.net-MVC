
(function () {
  "use strict";

  const TOAST_DURATION = 3000;

  /* =========================
     SHARED STYLES
  ========================= */

  function injectSharedStyles() {
    if (document.getElementById("pharmacy-shared-styles")) return;

    const style = document.createElement("style");
    style.id = "pharmacy-shared-styles";

    style.textContent = `
      .pharmacy-toast-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
      }

      .pharmacy-toast {
        min-width: 250px;
        max-width: 360px;
        padding: 14px 18px;
        border-radius: 10px;
        background: #fff;
        color: #26332d;
        box-shadow: 0 8px 25px rgba(0,0,0,.12);
        border-left: 4px solid #16845b;
        font-size: 14px;
        line-height: 1.5;
        opacity: 0;
        transform: translateY(-8px);
        transition: opacity .2s ease, transform .2s ease;
        pointer-events: auto;
      }

      .pharmacy-toast.is-visible {
        opacity: 1;
        transform: translateY(0);
      }

      .pharmacy-toast-success {
        border-left-color: #16845b;
      }

      .pharmacy-toast-error {
        border-left-color: #dc3545;
      }

      .pharmacy-toast-warning {
        border-left-color: #e6a23c;
      }

      .customer-header .container {
        position: relative;
      }

      @media (max-width: 760px) {
        .customer-nav.pharmacy-mobile-open {
          display: flex !important;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          height: auto !important;
          padding: 12px 20px;
          flex-direction: column;
          align-items: stretch;
          gap: 0;
          background: #fff;
          border-top: 1px solid #edf0ee;
          border-bottom: 1px solid #edf0ee;
          box-shadow: 0 12px 25px rgba(0,0,0,.08);
          z-index: 1000;
        }

        .customer-nav.pharmacy-mobile-open a {
          display: block;
          padding: 13px 4px;
          border-bottom: 1px solid #f0f2f1;
        }

        .customer-nav.pharmacy-mobile-open a:last-child {
          border-bottom: 0;
        }

        .customer-nav.pharmacy-mobile-open a::after {
          display: none !important;
        }
      }

      @media (max-width: 480px) {
        .pharmacy-toast-container {
          top: 12px;
          left: 12px;
          right: 12px;
        }

        .pharmacy-toast {
          min-width: 0;
          max-width: none;
          width: 100%;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* =========================
     TOAST
  ========================= */

  function getToastContainer() {
    let container = document.querySelector(
      ".pharmacy-toast-container"
    );

    if (!container) {
      container = document.createElement("div");
      container.className = "pharmacy-toast-container";
      container.setAttribute("aria-live", "polite");
      container.setAttribute("aria-atomic", "true");
      document.body.appendChild(container);
    }

    return container;
  }

  function toast(message, type = "success", duration = TOAST_DURATION) {
    const allowedTypes = ["success", "error", "warning"];
    const safeType = allowedTypes.includes(type) ? type : "success";

    const container = getToastContainer();
    const item = document.createElement("div");

    item.className = `pharmacy-toast pharmacy-toast-${safeType}`;
    item.setAttribute("role", "status");
    item.textContent = String(message);

    container.appendChild(item);

    requestAnimationFrame(() => {
      item.classList.add("is-visible");
    });

    window.setTimeout(() => {
      item.classList.remove("is-visible");

      window.setTimeout(() => {
        item.remove();

        if (!container.children.length) {
          container.remove();
        }
      }, 250);
    }, Math.max(500, Number(duration) || TOAST_DURATION));
  }

  /* =========================
     MODALS
  ========================= */

  function openModal(modalId) {
    const modal = document.getElementById(
      String(modalId).replace(/^#/, "")
    );

    if (!modal || !modal.classList.contains("modal")) {
      console.warn("Modal not found:", modalId);
      return;
    }

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    const firstInput = modal.querySelector(
      "input:not([type='hidden']), select, textarea, button"
    );

    if (firstInput) {
      window.setTimeout(() => firstInput.focus(), 100);
    }
  }

  function closeModal(modalOrId) {
    let modal = null;

    if (typeof modalOrId === "string") {
      modal = document.getElementById(
        modalOrId.replace(/^#/, "")
      );
    } else if (modalOrId instanceof Element) {
      modal = modalOrId;
    }

    if (!modal) return;

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");

    if (!document.querySelector(".modal.active")) {
      document.body.classList.remove("modal-open");
    }
  }

  function closeAllModals() {
    document.querySelectorAll(".modal.active").forEach((modal) => {
      closeModal(modal);
    });
  }

  /* =========================
     ADMIN SIDEBAR
  ========================= */

  function openSidebar() {
    const sidebar = document.querySelector(".admin-sidebar");
    const overlay = document.querySelector(".sidebar-overlay");
    const toggle = document.querySelector(".sidebar-toggle");

    if (!sidebar) return;

    sidebar.classList.add("open");

    if (overlay) {
      overlay.classList.add("active");
    }

    document.body.classList.add("sidebar-open");

    if (toggle) {
      toggle.setAttribute("aria-expanded", "true");
    }
  }

  function closeSidebar() {
    const sidebar = document.querySelector(".admin-sidebar");
    const overlay = document.querySelector(".sidebar-overlay");
    const toggle = document.querySelector(".sidebar-toggle");

    if (sidebar) {
      sidebar.classList.remove("open");
    }

    if (overlay) {
      overlay.classList.remove("active");
    }

    document.body.classList.remove("sidebar-open");

    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
    }
  }

  function initSidebarButtons() {
    const toggle = document.querySelector(".sidebar-toggle");
    const overlay = document.querySelector(".sidebar-overlay");

    if (toggle) {
      toggle.addEventListener("click", () => {
        const sidebar = document.querySelector(".admin-sidebar");

        if (sidebar && sidebar.classList.contains("open")) {
          closeSidebar();
        } else {
          openSidebar();
        }
      });
    }

    if (overlay) {
      overlay.addEventListener("click", closeSidebar);
    }

    document.querySelectorAll(".admin-sidebar a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 900) {
          closeSidebar();
        }
      });
    });
  }

  /* =========================
     CUSTOMER MOBILE MENU
  ========================= */

  function closeCustomerMenu() {
    const nav = document.querySelector(".customer-nav");
    const toggle = document.querySelector(".mobile-menu-toggle");

    if (nav) {
      nav.classList.remove("pharmacy-mobile-open");
    }

    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }
  }

  function toggleCustomerMenu() {
    const nav = document.querySelector(".customer-nav");
    const toggle = document.querySelector(".mobile-menu-toggle");

    if (!nav) return;

    const isOpen = nav.classList.toggle("pharmacy-mobile-open");

    if (toggle) {
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute(
        "aria-label",
        isOpen ? "Close menu" : "Open menu"
      );
    }
  }

  function initCustomerMenu() {
    const toggle = document.querySelector(".mobile-menu-toggle");
    const nav = document.querySelector(".customer-nav");

    if (!toggle || !nav) return;

    toggle.setAttribute("aria-expanded", "false");

    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleCustomerMenu();
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        closeCustomerMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (!nav.contains(event.target) && !toggle.contains(event.target)) {
        closeCustomerMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeCustomerMenu();
      }
    });
  }

  /* =========================
     PASSWORD TOGGLE
  ========================= */

  function initPasswordToggle() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-password-toggle]");

      if (!button) return;

      const targetId = button.getAttribute("data-password-toggle");
      const input = document.getElementById(targetId);

      if (!input) return;

      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";

      button.setAttribute(
        "aria-label",
        isPassword ? "Hide password" : "Show password"
      );

      if (button.textContent.trim()) {
        button.textContent = isPassword ? "Hide" : "Show";
      }
    });
  }

  /* =========================
     MODAL BUTTONS
  ========================= */

  function initModalButtons() {
    document.addEventListener("click", (event) => {
      const openButton = event.target.closest("[data-modal-open]");

      if (openButton) {
        openModal(openButton.getAttribute("data-modal-open"));
        return;
      }

      const closeButton = event.target.closest("[data-modal-close]");

      if (closeButton) {
        const modal = closeButton.closest(".modal");

        if (modal) {
          closeModal(modal);
        }

        return;
      }

      const modal = event.target.closest(".modal");

      if (modal && event.target === modal) {
        closeModal(modal);
      }
    });
  }

  /* =========================
     CONFIRM ACTIONS
  ========================= */

  function initConfirmButtons() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-confirm]");

      if (!button) return;

      const message =
        button.getAttribute("data-confirm") ||
        "Are you sure you want to continue?";

      const accepted = window.confirm(message);

      if (!accepted) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }

      button.dispatchEvent(
        new CustomEvent("pharmacy:confirmed", {
          bubbles: true,
          detail: { button }
        })
      );
    });
  }

  /* =========================
     FORM VALIDATION
  ========================= */

  function initFormValidation() {
    document.addEventListener("submit", (event) => {
      const form = event.target;

      if (!(form instanceof HTMLFormElement)) return;
      if (form.hasAttribute("data-checkout-form")) return;

      const supportedForms = [
        "[data-auth-form]",
        "#addBranchForm",
        "#editBranchForm",
        "#addMedicineForm",
        "#editMedicineForm"
      ].join(",");

      if (!form.matches(supportedForms)) return;

      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (form.id === "registerForm") {
        const password = form.querySelector('input[name="password"]');
        const confirmPassword = form.querySelector(
          'input[name="confirmPassword"]'
        );

        if (
          password &&
          confirmPassword &&
          password.value !== confirmPassword.value
        ) {
          confirmPassword.setCustomValidity("Passwords do not match.");
          confirmPassword.reportValidity();
          confirmPassword.setCustomValidity("");
          return;
        }
      }

      toast(
        "The interface is ready. Backend connection is required for this action.",
        "warning",
        4500
      );
    });

    document.addEventListener("input", (event) => {
      if (
        event.target.matches(
          '#registerForm input[name="confirmPassword"]'
        )
      ) {
        event.target.setCustomValidity("");
      }
    });
  }

  /* =========================
     ESCAPE KEY
  ========================= */

  function initEscapeKey() {
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;

      closeAllModals();
      closeSidebar();
      closeCustomerMenu();
    });
  }

  /* =========================
     INITIALIZE
  ========================= */

  function init() {
    injectSharedStyles();
    initCustomerMenu();
    initPasswordToggle();
    initModalButtons();
    initSidebarButtons();
    initConfirmButtons();
    initFormValidation();
    initEscapeKey();
  }

  /* =========================
     PUBLIC API
  ========================= */

  window.PharmacyUI = {
    toast,
    openModal,
    closeModal,
    closeAllModals,
    openSidebar,
    closeSidebar,
    closeCustomerMenu
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
