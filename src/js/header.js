import { headerSearch } from "../../plugins/ComponentsUi/HeaderSearch/HeaderSearch";
import { detectCloseElement } from "./helper";
/*==================== Header ====================*/
/**
 * @param header
 */
const vw = $(window).width();
export const header = {
	scrollActive: function () {
		let height = $("header").height();
		if ($(window).scrollTop() > height) {
			$("header").addClass("active");
		} else {
			$("header").removeClass("active");
		}
	},
	mobile: function () {
		$(".header-bar").on("click", function () {
			$(this).toggleClass("active");
			$("body").toggleClass("isOpenMenu");
		});
		$(".header-close").on("click", function () {
			$(".header-bar").removeClass("active");
			$("body").removeClass("isOpenMenu");
		});
		$(".header-overlay").on("click", function () {
			$(".header-bar").removeClass("active");
			$("body").removeClass("isOpenMenu");
		});
		// Handle mobile sub-menu toggle
		$(".menu-mobile .menu-item-has-children .dropdown-toggle").on("click", function (e) {
			if (window.matchMedia("(max-width: 1199.98px)").matches) {
				const $parent = $(this).closest("li");
				$parent.toggleClass("active");
				$parent.find("> ul.sub-menu").slideToggle(300);
				
				// Optional: Close other sub-menus
				$parent.siblings().removeClass("active").find("> ul.sub-menu").slideUp(300);
			}
		});
	},
	initVariable: function () {
		const $header = document.querySelector("header");
		if (!$header) return;

		// Hàm cập nhật chiều cao header
		function updateHeaderHeight() {
			const height = $header.offsetHeight;
			document.documentElement.style.setProperty("--header-height", `${height}px`);
		}

		// Cập nhật ban đầu
		updateHeaderHeight();

		// Theo dõi mọi thay đổi chiều cao của header
		const ro = new ResizeObserver(updateHeaderHeight);
		ro.observe($header);

		// Phòng trường hợp ảnh hoặc font chưa load xong
		window.addEventListener("load", () => {
			setTimeout(updateHeaderHeight, 100);
		});
	},
	init: function () {
		headerSearch();
		header.scrollActive();
		header.mobile();
		header.initVariable();
	},
};
document.addEventListener(
	"scroll",
	function (e) {
		header.scrollActive();
	},
	true
);
