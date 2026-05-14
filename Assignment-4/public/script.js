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