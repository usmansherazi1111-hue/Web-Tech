 const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    const desktopNav = document.getElementById('desktopNav');
    const mobileLinks = mobileNav.querySelectorAll('.text:not(.search-box)');

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      hamburger.classList.toggle('active');

      // Change icon from hamburger to close
      const icon = hamburger.querySelector('i');
      if (mobileNav.classList.contains('open')) {
        icon.classList.remove('ri-menu-line');
        icon.classList.add('ri-close-line');
      } else {
        icon.classList.remove('ri-close-line');
        icon.classList.add('ri-menu-line');
      }
    });

    // Close menu when any nav link is clicked (Bonus requirement)
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('active');
        const icon = hamburger.querySelector('i');
        icon.classList.remove('ri-close-line');
        icon.classList.add('ri-menu-line');
      });
    });


  // =============================
// FETCH PRODUCTS USING AJAX
// =============================

$(document).ready(function () {

  $.ajax({
    url: "https://fakestoreapi.com/products?limit=4",
    method: "GET",
    success: function (data) {

      const container = $("#product-section");
      container.empty(); // clear existing products

      data.forEach(product => {

        const card = `
  <div class="product-card">

    <img src="${product.image}" alt="${product.title}" />

    <p class="product-name">
      ${product.title.substring(0, 25)}...
    </p>

    <span class="product-weight">$${product.price}</span>

    <button class="quick-btn"
      data-title="${product.title}"
      data-desc="${product.description}"
      data-rating="${product.rating.rate}"
      data-image="${product.image}">
      Quick View
    </button>

  </div>
`;
        container.append(card);
      });
    }
  });

});


// =============================
// MODAL FUNCTIONALITY
// =============================

$(document).on("click", ".quick-btn", function () {

  const title = $(this).data("title");
  const desc = $(this).data("desc");
  const rating = $(this).data("rating");
  const image = $(this).data("image");

  $("#modalTitle").text(title);
  $("#modalDesc").text(desc);
  $("#modalImage").attr("src", image);

  // ⭐ Generate stars
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.round(rating)) {
      stars += "★";
    } else {
      stars += "☆";
    }
  }

  $("#modalStars").text(stars + ` (${rating})`);

  $("#modal").css("display", "flex");
});

$(document).on("click", "#closeModal", function () {
  $("#modal").css("display", "none");
});