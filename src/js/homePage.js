import { animate, createSpring, onScroll, stagger, utils } from "animejs";
import { getRem } from "./utils";
import { SplitText } from "gsap/SplitText";
import Swiper from "swiper";
import { Pagination, Navigation, Grid, Autoplay } from "swiper/modules";

const homeSection = utils.$("section[class*='home-']");


export const homePage = {
	home_2: () => {
		const section = document.querySelector('.home-2');
		if (!section) return;

		const titleWrapper = section.querySelector('.title-wrapper');
		if (!titleWrapper) return;
		
		const titleList = titleWrapper.querySelector('.title-list');
		const items = titleList.querySelectorAll('.title-item');
		if (items.length <= 1) return;

		const setWrapperHeight = () => {
			if (intervalId) {
				clearInterval(intervalId);
			}

			titleList.style.transition = 'none';
			titleList.style.transform = 'translateY(0)';
			
			// Reset height to auto to get the real height of the first item
			titleWrapper.style.height = 'auto';
			
			// Force reflow
			void titleWrapper.offsetHeight;
			
			const itemHeight = items[0].offsetHeight;

			// Nếu tính được height > 0 thì mới set, tránh trường hợp bị 0px
			if (itemHeight > 0) {
				titleWrapper.style.height = `${itemHeight}px`;
			} else {
				// Fallback nếu không tính được height (ví dụ đang hidden)
				titleWrapper.style.height = 'auto'; 
			}
			
			// Khôi phục lại trạng thái và khởi động lại animation
			currentIndex = 0; // Reset index về 0 để chạy lại từ đầu cho ổn định
			
			startAnimation();
		};
		
		// Wait for fonts to load before setting initial height
		document.fonts.ready.then(() => {
			setTimeout(setWrapperHeight, 100);
		});
		
		// Check xem event listener có thực sự được attach hay không
		
		// Lắng nghe sự kiện resize của window thay vì ResizeObserver để tránh loop vô hạn
		let resizeTimer;
		const handleResize = () => {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(() => {
				setWrapperHeight();
			}, 100);
		};
		
		window.addEventListener('resize', handleResize);

		let currentIndex = 0;
		const totalItems = items.length;
		let intervalId;

		const startAnimation = () => {
			if (intervalId) clearInterval(intervalId);

			const runLoop = () => {
				// Kiểm tra lại height mỗi lần chạy để đảm bảo luôn đúng kể cả sau khi resize
				const itemHeight = items[0].offsetHeight;
				if (itemHeight === 0) {
					return; // Nếu height = 0 thì không chạy (tránh lỗi)
				}

				currentIndex++;
				
				titleList.style.transition = 'transform 0.5s ease-in-out';
				titleList.style.transform = `translateY(-${currentIndex * itemHeight}px)`;

				if (currentIndex === totalItems - 1) {
					setTimeout(() => {
						titleList.style.transition = 'none';
						titleList.style.transform = `translateY(0)`;
						currentIndex = 0;
					}, 500);
				}
			};

			intervalId = setInterval(runLoop, 2000);
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					startAnimation();
				} else {
					clearInterval(intervalId);
				}
			});
		}, { threshold: 0.2 });

		observer.observe(section);
	},

	home_counter: () => {
		const section = document.querySelector(".home-counter");
		if (!section) return;

		const counters = section.querySelectorAll(".number");
		// Reset về 0 khi chưa chạy
		counters.forEach(counter => {
			const target = counter.getAttribute("data-count");
			counter.innerText = "0+";
		});

		const runCounter = () => {
			counters.forEach(counter => {
				const target = +counter.getAttribute("data-count");
				const duration = 2000; // 2 seconds
				const stepTime = 30;
				const steps = duration / stepTime;
				const increment = target / steps;
				let current = 0;

				const timer = setInterval(() => {
					current += increment;
					if (current >= target) {
						counter.innerText = target + "+";
						clearInterval(timer);
					} else {
						counter.innerText = Math.ceil(current) + "+";
					}
				}, stepTime);
			});
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					runCounter();
					observer.unobserve(entry.target);
				}
			});
		}, { threshold: 0.5 });

		observer.observe(section);
	},

	home_3: () => {
		const observer = new IntersectionObserver(
			(entries, obs) => {
				entries.forEach((entry) => {
					const items = utils.$(entry.target.querySelectorAll(".product-item"));
					items.forEach((item) => {
						// Set trạng thái ban đầu: thu nhỏ và dịch xuống dưới
						utils.set(item, {
							scale: 0, // Thu nhỏ hoàn toàn (invisible)
							translateY: getRem(40), // Di chuyển xuống 40rem
							ease: "easeInOutSine", // Hiệu ứng chuyển động mượt
							duration: 300, // Thời gian setup: 300ms
						});
					});

					// Khi section xuất hiện 50% trong viewport -> chạy animation
					if (entry.intersectionRatio > 0.5) {
						// ANIMATE ITEMS: phóng to và di chuyển lên
						animate(items, {
							scale: 1, // Phóng to về kích thước bình thường
							translateY: 0, // Trở về vị trí ban đầu
							delay: stagger(120), // Mỗi item delay 50ms (hiệu ứng lần lượt)
						});
						// Ngừng theo dõi element sau khi animate (chỉ chạy 1 lần)
						obs.unobserve(entry.target);
					}
				});
			},
			{
				threshold: 0.5, // Kích hoạt khi 50% element xuất hiện trong viewport
			}
		);

		// Áp dụng observer cho tất cả sections có class .home-2
		utils.$(".home-3").forEach((section) => {
			observer.observe(section);
		});
	},
	home_4: () => {
		const section = document.querySelector('.home-4');
		if (!section) return;

		// Init Swiper
		const swiperEl = section.querySelector('.home-4-swiper');
		if (!swiperEl) return;

		let home4Swiper;
		const initSwiper = () => {
			if (home4Swiper) home4Swiper.destroy(true, true);
			
			home4Swiper = new Swiper('.home-4-swiper', {
				modules: [Pagination, Navigation],
				slidesPerView: 1,
				spaceBetween: 14,
				grid: {
					rows: 1,
				},
				breakpoints: {
					576: { slidesPerView: 2, spaceBetween: 20 },
					768: { slidesPerView: 3, spaceBetween: 20 },
					1024: { slidesPerView: 4, spaceBetween: 20 },
					1280: { slidesPerView: 5, spaceBetween: 20 },
				},
				pagination: {
					el: '.home-4-pagination',
					clickable: true,
				},
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev',
				},
			});
		};

		const tabs = section.querySelectorAll('.tab-item');
		// Get slides BEFORE init to avoid swiper classes pollution
		const wrapper = swiperEl.querySelector('.swiper-wrapper');
		// Clone nodes deep to keep initial state safe
		const originalSlides = Array.from(wrapper.children).map(node => node.cloneNode(true));
		
		initSwiper();

		tabs.forEach(tab => {
			tab.addEventListener('click', (e) => {
				e.preventDefault();
				
				tabs.forEach(t => t.classList.remove('active'));
				tab.classList.add('active');
				
				const filter = tab.getAttribute('data-tab');
				
				// Destroy Swiper
				if (home4Swiper) home4Swiper.destroy(true, true);
				
				wrapper.innerHTML = ''; // Clear Content
				
				const filteredSlides = filter === 'all' 
					? originalSlides 
					: originalSlides.filter(slide => slide.getAttribute('data-category') === filter);

				if (filteredSlides.length > 0) {
					filteredSlides.forEach(slide => {
						// Append CLONE so original stays intact for future filtering
						wrapper.appendChild(slide.cloneNode(true));
					});
					initSwiper();
				} else {
					wrapper.innerHTML = '<div style="width:100%; text-align:center; padding: 20px;">Không có sản phẩm phù hợp</div>';
				}
			});
		});
	},
	home_5: () => {
		const sections = document.querySelectorAll(".home-5");
		if (!sections.length) return;

		sections.forEach((section) => {
			const items = section.querySelectorAll(".accordion-item");
			const images = section.querySelectorAll(".col-left .img-main img");

			if (!items.length || !images.length) return;

			items.forEach((item) => {
				item.addEventListener("mouseenter", () => {
					if (item.classList.contains("active")) return;

					// Cập nhật class active cho accordion items
					items.forEach((i) => i.classList.remove("active"));
					item.classList.add("active");

					// Cập nhật class active cho hình ảnh dựa trên index
					const index = item.getAttribute("data-index");
					if (images[index]) {
						images.forEach((img) => img.classList.remove("active"));
						images[index].classList.add("active");
					}
				});
			});

			// Animation khi cuộn tới section (Entry Animation)
			const observer = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						animate(section, {
							opacity: [0, 1],
							translateY: [30, 0],
							duration: 1200,
							easing: "easeOutSine"
						});
						observer.unobserve(section);
					}
				});
			}, { threshold: 0.1 });

			observer.observe(section);
		});
	},
	home_items_animation: () => {
		const observer = new IntersectionObserver(
			(entries, obs) => {
				entries.forEach((entry, index) => {
					if (entry.intersectionRatio > 0.5) {
						animate(entry.target.querySelectorAll(".item"), {
							opacity: [0, 1],
							y: [getRem(40), 0],
							ease: createSpring({
								stiffness: 150,
							}),
							delay: stagger(100),
							duration: 600,
						});
						obs.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.5 }
		);

		utils.$(".home-item-animation").forEach((el) => {
			utils.set(el.querySelectorAll(".item"), {
				opacity: 0,
				y: getRem(40),
			});
			observer.observe(el);
		});
	},
	homeBlockTitles: () => {
		const observer = new IntersectionObserver(
			(entries, obs) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const title = entry.target;
						const position = window.getComputedStyle(title).textAlign;
						let animateFrom = "first";
						if (position === "center") {
							animateFrom = "center";
						}
						if (position === "right") {
							animateFrom = "last";
						}

						const splitText = SplitText.create(title, {
							type: "chars,words",
						});
						entry.target.closest(".block-title").style.opacity = 1;
						const chars = splitText.chars;
						animate(chars, {
							opacity: [0, 1],
							y: [getRem(20), 0],
							duration: 400,
							ease: createSpring({
								stiffness: 150,
							}),
							delay: stagger(20, {
								from: animateFrom,
							}),
						});
						obs.unobserve(title); // Only animate once
					}
				});
			},
			{
				threshold: 0.2, // Adjust as needed (20% visible)
			}
		);

		homeSection.forEach((home) => {
			const title = home.querySelector(".block-title");
			if (!title) return;
			title.style.opacity = 0;
			observer.observe(title);
		});
	},
	homeTitle: () => {
		const observer = new IntersectionObserver(
			(entries, obs) => {
				entries.forEach((entry) => {
					if (entry.intersectionRatio > 0.5) {
						const title = entry.target;
						const animateStyle = title.getAttribute("animate-title") || "fade-up";
						const position = window.getComputedStyle(title).textAlign;
						let animateFrom = "first";
						if (position === "center") {
							animateFrom = "center";
						}
						if (position === "right") {
							animateFrom = "last";
						}

						const splitText = SplitText.create(title, {
							type: "words",
						});

						title.style.overflow = "hidden";

						if (animateStyle === "fade-up") {
							animate(splitText.words, {
								opacity: [0, 1],
								y: ["100%", 0],
								duration: 600,
								ease: createSpring({
									stiffness: 150,
								}),
								delay: stagger(25, {
									from: animateFrom,
								}),
							});
						}
						if (animateStyle === "slide-up") {
							animate(splitText.words, {
								opacity: [0, 1],
								x: ["100%", 0],
								duration: 600,
								ease: createSpring({
									stiffness: 150,
								}),
								delay: stagger(25, {
									from: animateFrom,
								}),
							});
						}

						obs.unobserve(title); // Only animate once
					}
				});
			},
			{
				threshold: 0.5,
			}
		);

		homeSection.forEach((home) => {
			const title = home.querySelectorAll("[animate-title]");
			if (!title) return;
			title.forEach((item) => {
				observer.observe(item);
			});
		});
	},
	homeDescription: () => {
		const observer = new IntersectionObserver(
			(entries, obs) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const description = entry.target;
						let animateFrom = "first";
						// const position =
						// 	window.getComputedStyle(description).textAlign;
						// if (position === "center") {
						// 	animateFrom = "center";
						// } else if (position === "right") {
						// 	animateFrom = "last";
						// }

						const splitText = SplitText.create(description, {
							type: "words,lines",
						});
						description.style.opacity = 1;
						const words = splitText.words;
						const line = splitText.lines;
						line.forEach((line) => {
							line.style.height = line.offsetHeight + "px";
							line.style.overflow = "hidden";
						});
						animate(words, {
							opacity: [0, 1],
							translateY: [getRem(20), 0],
							duration: 500,
							delay: stagger(15, {
								from: animateFrom,
							}),
						});
						obs.unobserve(description); // Only animate once
					}
				});
			},
			{
				threshold: 0.2, // Adjust as needed (20% visible)
			}
		);

		homeSection.forEach((home) => {
			const description = home.querySelector(".desc2");
			if (!description) return;
			description.style.opacity = 0;
			observer.observe(description);
		});
	},
	homeButtons: () => {
		const observer = new IntersectionObserver(
			(entries, obs) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const wrap = entry.target;
						animate(wrap, {
							opacity: [0, 1],
							y: [45, 0],
							duration: 500,
						});
						obs.unobserve(wrap); // Only animate once
					}
				});
			},
			{
				threshold: 0.2, // Adjust as needed (20% visible)
			}
		);
	},
	primaryNav: () => {
		const observer = new IntersectionObserver(
			(entries, obs) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						animate(entry.target.querySelectorAll("li"), {
							opacity: 1,
							x: 0,
							duration: 600,
							delay: stagger(100),
							ease: createSpring({
								stiffness: 150,
								damping: 10,
							}),
						});
						obs.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.2 }
		);

		utils.$(".primary-nav").forEach((el) => {
			utils.set(el.querySelectorAll("li"), {
				opacity: 0,
				x: getRem(20),
			});
			observer.observe(el);
		});
	},


	home_7: () => {
		const section = document.querySelector(".home-7");
		if (!section) return;

		const swiperEl = section.querySelector(".home-7-swiper");
		if (!swiperEl) return;

		// Sử dụng Swiper Grid cho 2 dòng logo
		new Swiper(".home-7-swiper", {
			modules: [Navigation, Grid, Autoplay],
			slidesPerView: 2,
			grid: {
				rows: 2,
				fill: 'row',
			},
			spaceBetween: 20,
			navigation: {
				nextEl: ".home-7-next",
				prevEl: ".home-7-prev",
			},
			loop: false, // Grid không hỗ trợ loop true trong 1 số case, set false cho an toàn
			breakpoints: {
				768: {
					slidesPerView: 4,
					spaceBetween: 20,
				},
				1024: {
					slidesPerView: 5,
					spaceBetween: 20,
				},
				1440: {
					slidesPerView: 6,
					spaceBetween: 20,
				}
			},
			autoplay: {
				delay: 9000,
				disableOnInteraction: false,
			},
		});
	},

	home_8: () => {
		const section = document.querySelector(".home-8");
		if (!section) return;

		new Swiper(".home-8-swiper", {
			modules: [Navigation],
			slidesPerView: 1,
			spaceBetween: 12,
			navigation: {
				nextEl: ".home-8-next",
				prevEl: ".home-8-prev",
			},
			autoplay: {
				delay: 5000,
				disableOnInteraction: false,
			},
		});
	},

	init: () => {
		if ($("body.home").length === 0) return;
		// Kiểm tra class có tồn tại không trước khi chạy, không chặn theo width
		const section2 = document.querySelector('.home-2');
		if (section2) {
			homePage.home_2();
		}
		
		homePage.home_counter();
		
		// if ($(window).width() < 1200) return;
		// homePage.primaryNav();
		homePage.home_3();
		homePage.home_4();
		homePage.home_5();
		homePage.home_items_animation();
		homePage.home_7();
		homePage.home_8();
		homePage.homeButtons();
		document.fonts.ready.then((e) => {
			homePage.homeBlockTitles();
			homePage.homeTitle();
			homePage.homeDescription();
		});
	},
};
