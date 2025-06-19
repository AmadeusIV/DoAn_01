(() => {
    const events = [
      {
        id: 'evt01',
        title: 'Tuần Lễ Thời Trang Couture Việt Nam 2024',
        date: '2024-11-15T19:00',
        location: 'Nhà Hát Thành Phố Hồ Chí Minh',
        description: 'Trải nghiệm những bộ sưu tập mới nhất từ các nhà thiết kế hàng đầu Việt Nam.',
        image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b3ec4f4c-15da-4610-92b2-0354a8919555.png'
      },
      {
        id: 'evt02',
        title: 'Gặp Gỡ Fan Isaac - Tình Yêu',
        date: '2024-12-05T18:00',
        location: 'Trung Tâm Hội Nghị và Triển Lãm Sài Gòn',
        description: 'Tham gia gặp gỡ Isaac với những câu chuyện và âm nhạc tuyệt vời.',
        image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/da75bca2-9d8f-49d7-ac94-dd7bb23a895c.png'
      },
      {
        id: 'evt03',
        title: 'Tour Thế Giới Requiem Của Keshi',
        date: '2025-03-07T20:00',
        location: 'Sân Vận Động Quốc Gia Hà Nội',
        description: 'Đừng bỏ lỡ Keshi trong tour diễn Requiem đầy sôi động.',
        image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/2bd42109-b6fd-4d4a-9d11-89ef82d06779.png'
      },
      {
        id: 'evt04',
        title: 'Marathon Thành Phố Hồ Chí Minh 2025',
        date: '2025-01-22T06:00',
        location: 'Đại Lộ Marina, Thành Phố Hồ Chí Minh',
        description: 'Chạy bộ qua các địa danh biểu tượng trong giải marathon hạng nhất.',
        image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/47e742d9-52de-400a-b20f-6d79201607a9.png'
      },
      {
        id: 'evt05',
        title: 'Liên Hoan Phim Quốc Tế Việt Nam',
        date: '2024-10-20T14:00',
        location: 'Trung Tâm Điện Ảnh Quốc Gia Hà Nội',
        description: 'Khám phá những câu chuyện mới và kinh điển bất hủ tại liên hoan phim hàng đầu.',
        image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d1972c57-03c5-4987-b6ac-f70e127d9145.png'
      }
    ];

    const eventsGrid = document.getElementById('eventsGrid');
    const searchInput = document.getElementById('searchInput');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const bookingForm = modalOverlay.querySelector('.booking-form');
    const eventNameInput = document.getElementById('eventName');
    const ticketQuantityInput = document.getElementById('ticketQuantity');
    const buyerNameInput = document.getElementById('buyerName');
    const buyerEmailInput = document.getElementById('buyerEmail');
    const quantityError = document.getElementById('quantityError');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const bookingSuccessMsg = document.getElementById('bookingSuccess');
    const toastContainer = document.getElementById('toast-container');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
    let filteredEvents = [...events];
    let currentBookingEvent = null;
    let lastFocusedElement;

    function trapFocus(element) {
      const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const focusableElements = element.querySelectorAll(focusableSelectors);
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
              e.preventDefault();
              lastFocusable.focus();
            }
          } else {
            if (document.activeElement === lastFocusable) {
              e.preventDefault();
              firstFocusable.focus();
            }
          }
        }
        if (e.key === 'Escape') {
          closeModal();
        }
      });
    }

    function showToast(message, type = 'info', duration = 4000) {
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.setAttribute('role','alert');
      toast.setAttribute('aria-live','assertive');
      toast.setAttribute('tabindex', '-1');
      const iconText = type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info';
      toast.innerHTML = `<span class="toast-icon material-icons" aria-hidden="true">${iconText}</span>${message}`;
      toastContainer.appendChild(toast);
      setTimeout(() => {
        toast.remove();
      }, duration);
    }

    function renderEvents(list) {
      eventsGrid.innerHTML = '';
      if (list.length === 0) {
        eventsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: var(--text-secondary); font-weight: 600;">Không tìm thấy sự kiện nào</p>';
        return;
      }
      list.forEach(evt => {
        const card = document.createElement('article');
        card.className = 'event-card';
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'region');
        card.setAttribute('aria-label', `${evt.title}, vào ngày ${new Date(evt.date).toLocaleDateString()}, địa điểm ${evt.location}`);
        card.innerHTML = `
          <div class="event-image">
            <img src="${evt.image}" alt="Hình ảnh sự kiện ${evt.title}" loading="lazy" onerror="this.src='https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/cb0f2c96-5fbe-409d-b115-7907f97cc18a.png';" />
          </div>
          <div class="event-content">
            <h3 class="event-title">${evt.title}</h3>
            <time class="event-date" datetime="${evt.date}">${new Date(evt.date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</time>
            <p class="event-description">${evt.description}</p>
            <p class="event-location"><span class="material-icons" aria-hidden="true" style="font-size:16px;vertical-align:middle;">location_on</span> ${evt.location}</p>
            <div class="event-actions">
              <button class="btn book-btn" data-id="${evt.id}" aria-label="Đặt vé cho sự kiện ${evt.title}">
                <span class="material-icons" aria-hidden="true">event_available</span> Đặt Vé
              </button>
            </div>
          </div>
        `;
        eventsGrid.appendChild(card);
      });
    }

    function filterEvents(query) {
      if (!query.trim()) return [...events];
      const lowerQ = query.toLowerCase();
      return events.filter(evt => 
        evt.title.toLowerCase().includes(lowerQ) ||
        evt.description.toLowerCase().includes(lowerQ) ||
        evt.location.toLowerCase().includes(lowerQ)
      );
    }

    function openModal(eventId) {
      currentBookingEvent = events.find(e => e.id === eventId);
      if (!currentBookingEvent) return;
      eventNameInput.value = currentBookingEvent.title;
      ticketQuantityInput.value = '';
      buyerNameInput.value = '';
      buyerEmailInput.value = '';
      quantityError.textContent = '';
      nameError.textContent = '';
      emailError.textContent = '';
      bookingSuccessMsg.hidden = true;
      bookingForm.style.display = 'flex';
      modalOverlay.classList.add('active');
      modalOverlay.focus();
      lastFocusedElement = document.activeElement;
      trapFocus(modalOverlay);
    }
    function closeModal() {
      modalOverlay.classList.remove('active');
      if (lastFocusedElement) lastFocusedElement.focus();
    }

    function validateBooking() {
      let valid = true;
      quantityError.textContent = '';
      nameError.textContent = '';
      emailError.textContent = '';

      const qty = ticketQuantityInput.value.trim();
      const qtyNum = Number(qty);
      if (!qty || isNaN(qtyNum) || qtyNum < 1 || qtyNum > 20) {
        quantityError.textContent = 'Vui lòng nhập số lượng vé hợp lệ (1-20).';
        valid = false;
      }

      const nameVal = buyerNameInput.value.trim();
      if (nameVal.length < 2) {
        nameError.textContent = 'Tên phải có ít nhất 2 ký tự.';
        valid = false;
      }

      const emailVal = buyerEmailInput.value.trim();
      const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      if (!emailPattern.test(emailVal)) {
        emailError.textContent = 'Vui lòng nhập địa chỉ email hợp lệ.';
        valid = false;
      }

      return valid;
    }

    bookingForm.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!validateBooking()) return;

      bookingForm.style.display = 'none';
      bookingSuccessMsg.hidden = false;
      showToast(`Đặt vé thành công cho sự kiện ${currentBookingEvent.title}`, 'success');
      setTimeout(() => {
        closeModal();
      }, 3500);
    });

    const searchForm = document.querySelector('.search-bar');
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      filteredEvents = filterEvents(searchInput.value);
      renderEvents(filteredEvents);
    });

    let debounceTimeout;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        filteredEvents = filterEvents(searchInput.value);
        renderEvents(filteredEvents);
      }, 300);
    });

    eventsGrid.addEventListener('click', (e) => {
      if (e.target.closest('.book-btn')) {
        const btn = e.target.closest('.book-btn');
        const eventId = btn.dataset.id;
        openModal(eventId);
      }
    });

    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.add('open');
      sidebarToggle.setAttribute('aria-expanded', 'true');
      sidebar.focus();
    });
    sidebarCloseBtn.addEventListener('click', () => {
      sidebar.classList.remove('open');
      sidebarToggle.setAttribute('aria-expanded', 'false');
      sidebarToggle.focus();
    });
    sidebar.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        sidebar.classList.remove('open');
        sidebarToggle.setAttribute('aria-expanded', 'false');
        sidebarToggle.focus();
      }
    });

    renderEvents(events);
    document.querySelector('.event-card')?.focus();

  })();