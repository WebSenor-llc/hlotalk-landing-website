document.addEventListener("DOMContentLoaded", () => {
  // FAQ Accordion
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const header = item.querySelector(".faq-header");
    header.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");

      // Close all other items
      faqItems.forEach((i) => i.classList.remove("active"));

      if (!isOpen) {
        item.classList.add("active");
      }
    });
  });

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  // Delete Account Modal Logic
  const deleteTrigger = document.getElementById("delete-account-trigger");
  const deleteModal = document.getElementById("deleteModal");
  const modalClose = document.querySelector(".modal-close");
  const deleteForm = document.getElementById("deleteAccountForm");

  if (deleteTrigger && deleteModal) {
    deleteTrigger.addEventListener("click", (e) => {
      e.preventDefault();
      deleteModal.classList.add("active");
    });

    modalClose.addEventListener("click", () => {
      deleteModal.classList.remove("active");
    });

    // Close on outside click
    window.addEventListener("click", (e) => {
      if (e.target === deleteModal) {
        deleteModal.classList.remove("active");
      }
    });

    // Toast Utility
    const showToast = (message, type = "success") => {
      const toastContainer = document.getElementById("toastContainer");
      if (!toastContainer) return;

      const toast = document.createElement("div");
      toast.className = `toast ${type}`;
      toast.innerText = message;

      toastContainer.appendChild(toast);

      // Remove after 4 seconds
      setTimeout(() => {
        toast.classList.add("fade-out");
        setTimeout(() => {
          toast.remove();
        }, 400);
      }, 4000);
    };

    // Form Submission to API
    deleteForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(deleteForm);
      const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        phoneNumber: formData.get("phone"), // Changed from 'phone' to 'phoneNumber' to match Swagger
      };

      const submitBtn = deleteForm.querySelector(".btn-submit");
      const originalText = submitBtn.innerText;

      try {
        submitBtn.innerText = "Submitting...";
        submitBtn.disabled = true;

        // Corrected URL to match Swagger: /api/v1/users/deletion-request
        const response = await fetch(
          "https://hlotalk.peclick.co.in/api/v1/users/deletion-request",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          },
        );

        if (response.ok) {
          showToast("Request sent successfully! Our team will process it.");
          deleteForm.reset();
          deleteModal.classList.remove("active");
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to submit request.");
        }
      } catch (error) {
        console.error("Error:", error);
        showToast(error.message || "Something went wrong.", "error");
      } finally {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
      }
    });

    // Contact Form Logic
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector("button[type='submit']");
        const originalText = submitBtn.innerText;

        submitBtn.innerText = "Sending...";
        submitBtn.disabled = true;

        // Simulate API call for contact form
        setTimeout(() => {
          showToast("Thank you! Your message has been sent successfully.");
          contactForm.reset();
          submitBtn.innerText = originalText;
          submitBtn.disabled = false;
        }, 1500);
      });
    }
  }
});
