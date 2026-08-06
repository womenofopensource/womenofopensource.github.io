//
//
// Personal JS
//
//



(function ($) {
	'use strict';



	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Navigation

	// Global vars
	var navTarget = $('body').attr('data-page-url');
	var docTitle = document.title;
	var History = window.History;



	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - hCaptcha

	// Render hCaptcha widgets explicitly. The theme swaps page content via AJAX, so
	// hCaptcha's automatic rendering (which scans the DOM only once) misses widgets
	// loaded after the initial page. Exposed globally so the hCaptcha API's `onload`
	// callback can call it too (see api.js include in default.html).
	window.renderHCaptchas = function () {

		if ( typeof window.hcaptcha === 'undefined' ) { return; }

		$('.h-captcha').each( function () {

			var $el = $(this);

			// Skip widgets that are already rendered
			if ( $el.data('rendered') || $el.find('iframe').length ) { return; }

			try {
				window.hcaptcha.render( this, { sitekey: $el.attr('data-sitekey') } );
				$el.data('rendered', true);
			} catch (e) {
				// Already rendered or API not ready yet – ignore
			}
		});
	};



	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Speakers directory

	// Search + filter behaviour for the speakers directory. Lives here (not inline on the
	// page) because the theme loads pages via AJAX and jQuery's .load() strips <script> tags
	// from the fetched content, so page-level scripts never run on AJAX navigation. Called
	// from pageFunctions() on every page load (initial and AJAX); guarded to no-op off the
	// speakers page.
	window.initSpeakersDirectory = function () {

		var searchInput = document.getElementById('speaker-search');
		if ( !searchInput ) { return; }

		var expertiseInput = document.getElementById('expertise-search');
		var expertiseDropdown = document.getElementById('expertise-dropdown');
		var expertiseFilterSearch = document.getElementById('expertise-filter-search');
		var locationInput = document.getElementById('location-search');
		var locationDropdown = document.getElementById('location-dropdown');
		var locationFilterSearch = document.getElementById('location-filter-search');
		var resetButton = document.getElementById('reset-filters');
		var speakerCards = document.querySelectorAll('.speaker-card');
		var speakerCount = document.getElementById('speaker-count');
		var noResults = document.getElementById('no-results');

		var selectedFilters = {
			expertise: new Set(),
			location: new Set()
		};

		function toggleDropdown(dropdown, filterGroup) {
			var isActive = dropdown.classList.contains('active');
			var comboboxInput = filterGroup.querySelector('[role="combobox"]');

			// Close all dropdowns first
			document.querySelectorAll('.speakers-filter__dropdown').forEach(function (d) {
				d.classList.remove('active');
			});
			document.querySelectorAll('.speakers-filter-group').forEach(function (g) {
				g.classList.remove('active');
				var input = g.querySelector('[role="combobox"]');
				if (input) input.setAttribute('aria-expanded', 'false');
			});

			// Toggle the clicked one
			if (!isActive) {
				dropdown.classList.add('active');
				filterGroup.classList.add('active');
				if (comboboxInput) comboboxInput.setAttribute('aria-expanded', 'true');
				var ddSearch = dropdown.querySelector('.speakers-filter__dropdown-search');
				if (ddSearch) {
					setTimeout(function () { ddSearch.focus(); }, 100);
				}
			}
		}

		function updateFilterPlaceholder(filterType) {
			var count = selectedFilters[filterType].size;
			var input = filterType === 'expertise' ? expertiseInput : locationInput;
			var defaultText = filterType === 'expertise' ? 'Filter by expertise...' : 'Filter by country...';

			if (count > 0) {
				input.value = count + ' selected';
			} else {
				input.value = '';
				input.placeholder = defaultText;
			}
		}

		function filterTagVisibility(searchField, tagsContainer) {
			var searchTerm = searchField.value.toLowerCase();
			var tags = tagsContainer.querySelectorAll('.filter-tag');

			tags.forEach(function (tag) {
				var text = tag.textContent.toLowerCase();
				tag.style.display = text.includes(searchTerm) ? '' : 'none';
			});
		}

		// Toggle tag selection
		document.querySelectorAll('.filter-tag').forEach(function (tag) {
			tag.addEventListener('click', function (e) {
				e.stopPropagation();
				var filterType = this.dataset.filter;
				var value = this.dataset.value;

				if (this.classList.contains('active')) {
					this.classList.remove('active');
					this.setAttribute('aria-selected', 'false');
					selectedFilters[filterType].delete(value);
				} else {
					this.classList.add('active');
					this.setAttribute('aria-selected', 'true');
					selectedFilters[filterType].add(value);
				}

				updateFilterPlaceholder(filterType);
				filterSpeakers();
			});
		});

		// Open dropdowns on click
		expertiseInput.addEventListener('click', function (e) {
			e.stopPropagation();
			toggleDropdown(expertiseDropdown, this.closest('.speakers-filter-group'));
		});

		locationInput.addEventListener('click', function (e) {
			e.stopPropagation();
			toggleDropdown(locationDropdown, this.closest('.speakers-filter-group'));
		});

		// Keyboard support for opening dropdowns
		expertiseInput.addEventListener('keydown', function (e) {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				toggleDropdown(expertiseDropdown, this.closest('.speakers-filter-group'));
			}
		});

		locationInput.addEventListener('keydown', function (e) {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				toggleDropdown(locationDropdown, this.closest('.speakers-filter-group'));
			}
		});

		// Filter tags in dropdowns
		expertiseFilterSearch.addEventListener('input', function () {
			filterTagVisibility(this, document.getElementById('expertise-tags'));
		});

		locationFilterSearch.addEventListener('input', function () {
			filterTagVisibility(this, document.getElementById('location-tags'));
		});

		// Close dropdowns when clicking outside. Bound on document (which persists across
		// AJAX navigations), so bind it only once.
		if (!window.__speakersOutsideClickBound) {
			window.__speakersOutsideClickBound = true;
			document.addEventListener('click', function (e) {
				if (!e.target.closest('.speakers-filter-group')) {
					document.querySelectorAll('.speakers-filter__dropdown').forEach(function (d) {
						d.classList.remove('active');
					});
					document.querySelectorAll('.speakers-filter-group').forEach(function (g) {
						g.classList.remove('active');
						var input = g.querySelector('[role="combobox"]');
						if (input) input.setAttribute('aria-expanded', 'false');
					});
				}
			});
		}

		// Prevent dropdown from closing when clicking inside
		document.querySelectorAll('.speakers-filter__dropdown').forEach(function (dropdown) {
			dropdown.addEventListener('click', function (e) {
				e.stopPropagation();
			});
		});

		function filterSpeakers() {
			var searchTerm = searchInput.value.toLowerCase();
			var visibleCount = 0;

			speakerCards.forEach(function (card) {
				var name = card.dataset.name;
				var location = card.dataset.location;
				var employer = card.dataset.employer;
				var expertise = card.dataset.expertise;

				var matchesSearch = !searchTerm ||
					name.includes(searchTerm) ||
					location.includes(searchTerm) ||
					employer.includes(searchTerm) ||
					expertise.includes(searchTerm);

				var matchesExpertise = selectedFilters.expertise.size === 0 ||
					Array.from(selectedFilters.expertise).some(function (value) { return expertise.includes(value); });
				var matchesLocation = selectedFilters.location.size === 0 ||
					Array.from(selectedFilters.location).some(function (value) { return location.includes(value); });

				if (matchesSearch && matchesExpertise && matchesLocation) {
					card.style.display = '';
					visibleCount++;
				} else {
					card.style.display = 'none';
				}
			});

			speakerCount.textContent = visibleCount;
			noResults.style.display = visibleCount === 0 ? 'block' : 'none';
		}

		function resetFilters() {
			searchInput.value = '';
			expertiseFilterSearch.value = '';
			locationFilterSearch.value = '';

			document.querySelectorAll('.filter-tag').forEach(function (tag) {
				tag.classList.remove('active');
				tag.setAttribute('aria-selected', 'false');
				tag.style.display = '';
			});

			selectedFilters.expertise.clear();
			selectedFilters.location.clear();

			updateFilterPlaceholder('expertise');
			updateFilterPlaceholder('location');

			// Close all dropdowns
			document.querySelectorAll('.speakers-filter__dropdown').forEach(function (d) {
				d.classList.remove('active');
			});
			document.querySelectorAll('.speakers-filter-group').forEach(function (g) {
				g.classList.remove('active');
				var input = g.querySelector('[role="combobox"]');
				if (input) input.setAttribute('aria-expanded', 'false');
			});

			filterSpeakers();
		}

		searchInput.addEventListener('input', filterSpeakers);
		resetButton.addEventListener('click', resetFilters);
	};

	// State change event
	History.Adapter.bind(window,'statechange',function(){
		var state = History.getState();
		// console.log(state);

		// Loading state
		$('body').addClass('loading');

		// Load the page
		$('.page-loader').load( state.hash + ' .page__content', function() {

			// Scroll to top
			$( 'body, html' ).animate({
				scrollTop: 0
			}, 300);

			// Find transition time
			var transitionTime = 400;

			// After current content fades out
			setTimeout( function() {

				// Remove old content
				$('.page .page__content').remove();

				// Append new content
				$('.page-loader .page__content').appendTo('.page');

				// Set page URL
				$('body').attr('data-page-url', window.location.pathname);

				// Update navTarget
				navTarget = $('body').attr('data-page-url');

				// Set page title
				docTitle = $('.page__content').attr('data-page-title');
				document.title = docTitle;

				// Run page functions
				pageFunctions();

			}, transitionTime);

		});

	});


	// On clicking a link

	if ( $('body').hasClass('ajax-loading') ) {

		$(document).on('click', 'a', function (event){

			// Don't follow link
			event.preventDefault();

			// Get the link target
			var thisTarget = $(this).attr('href');

			// If we don't want to use ajax, or the link is an anchor/mailto/tel
			if ($(this).hasClass('js-no-ajax') || thisTarget.indexOf('#') >= 0 || thisTarget.indexOf('mailto:') >= 0 || thisTarget.indexOf('tel:') >= 0) {

				// Use the given link
				window.location = thisTarget;
			}

			// If link is handled by some JS action – e.g. fluidbox
			else if ( $(this).is('.gallery__item__link') ) {
				
				// Let JS handle it
			}

			// If link is external
			else if ( thisTarget.indexOf('http') >= 0 ) {

				// Go to the external link
				var newWindow = window.open(thisTarget, '_blank', 'noopener,noreferrer');
				if (newWindow) newWindow.opener = null;

			}

			// If link is internal
			else {

				// Change navTarget
				navTarget = thisTarget;
				
				// Switch the URL via History
				History.pushState(null, docTitle, thisTarget);
			}

		});

	}



	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Page load

	function pageFunctions() {


		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Show content

		// Wait until first image has loaded
		$('.page__content').find('.hero__image').imagesLoaded( { background: true }, function() {
	
			// Portfolio grid layout
			$('.portfolio-wrap').imagesLoaded( function() {
				$('.portfolio-wrap').masonry({
					itemSelector: '.portfolio-item',
					transitionDuration: 0
				});
			});

			// Blog grid layout
			$('.blog-wrap').imagesLoaded( function() {
				$('.blog-wrap').masonry({
					itemSelector: '.blog-post',
					transitionDuration: 0
				});
			});

			// Show the content
			$('body').removeClass('loading');

			// Hide the menu
			$('body').removeClass('menu--open');
		});



		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Active links

		// Switch active link states
		$('.active-link').removeClass('active-link');

		$('a[href="' + navTarget + '"]').addClass('active-link');



		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Galleries

		// Destroy all existing waypoints
		Waypoint.destroyAll();

		// Set up count for galleries to give them unique IDs
		var galleryCount = 0;

		// If there's a gallery
		$('.gallery').each( function() {

			// Get gallery element
			var $this = $(this);

			// Add ID via count
			galleryCount++;
			var thisId = 'gallery-' + galleryCount;
			$this.attr('id', thisId);

			// Gallery columns
			var galleryCols = $this.attr('data-columns');

			// Set up gallery container
			$this.append('<div class="gallery__wrap"></div>');

			// Add images to container
			$this.children('img').each( function() {
				$(this).appendTo('#' + thisId + ' .gallery__wrap');
			});

			// Wrap images
			$this.find('.gallery__wrap img').each( function() {
				var imageSrc = $(this).attr('src');
				$(this).wrapAll('<div class="gallery__item"><a href="' + imageSrc + '" class="gallery__item__link"></a></div>');
			});

			// Wait for images to load
			$this.imagesLoaded( function() {

				// If it's a single column gallery
				if ( galleryCols === '1' ) {

					// Add carousel class to gallery
					$this.addClass('gallery--carousel');

					// Add owl styles to gallery wrap
					$this.children('.gallery__wrap').addClass('owl-carousel');

					// Use carousel
					$this.children('.gallery__wrap').owlCarousel({
						items: 1,
						loop: true,
						mouseDrag: false,
						touchDrag: true,
						pullDrag: false,
						dots: true,
						autoplay: false,
						autoplayTimeout: 6000,
						autoHeight: true,
						animateOut: 'fadeOut'
					});

					// When scrolling over the bottom
					var waypoint1 = new Waypoint({
						element: document.getElementById(thisId),
						handler: function(direction) {

							if ( direction === 'down') {

								// console.log('pause');
							
								// Pause this carousel
								$this.children('.gallery__wrap').trigger('stop.owl.autoplay');
							}

							if ( direction === 'up') {

								// console.log('play');
								
								// Play this carousel
								$this.children('.gallery__wrap').trigger('play.owl.autoplay');
							}
						},
						offset: '-100%'
					});

					// When scrolling over the top
					var waypoint2 = new Waypoint({
						element: document.getElementById(thisId),
						handler: function(direction) {

							if ( direction === 'down') {

								// console.log('play');
								
								// Play this carousel
								$this.children('.gallery__wrap').trigger('play.owl.autoplay');
							}

							if ( direction === 'up') {

								// console.log('pause');
							
								// Pause this carousel
								$this.children('.gallery__wrap').trigger('stop.owl.autoplay');
							}
						},
						offset: '100%'
					});

				}

				else {

					$this.addClass('gallery--grid');

					// Use masonry layout
					$this.children('.gallery__wrap').masonry({
						itemSelector: '.gallery__item',
						transitionDuration: 0
					});
							
					// Init fluidbox
					$this.find('.gallery__item__link').fluidbox({
						loader: true
					});

				}

				// Show gallery once initialized
				$this.addClass('gallery--on');
			});

		});



		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Images

		$('.single p > img').each( function() {
			var thisP = $(this).parent('p');
			$(this).insertAfter(thisP);
			$(this).wrapAll('<div class="image-wrap"></div>');
			thisP.remove();
		});



		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Videos

		// For each iframe
		$('.single iframe').each( function() {

			// If it's YouTube or Vimeo
			if ( $(this).attr('src').indexOf('youtube') >= 0 || $(this).attr('src').indexOf('vimeo') >= 0 ) {

				var width = $(this).attr('width');
				var height = $(this).attr('height');
				var ratio = (height/width)*100;

				// Wrap in video container
				$(this).wrapAll('<div class="video-wrap"><div class="video" style="padding-bottom:' + ratio + '%;"></div></div>');

			}

		});



		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Tables

		$('.single table').each(function () {
			$(this).wrapAll('<div class="table-wrap"></div>');
		});



		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - hCaptcha

		// Render any hCaptcha widgets present in the (possibly AJAX-loaded) content
		window.renderHCaptchas();



		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Speakers directory

		// Wire up the speakers search/filters (no-op when not on the speakers page)
		window.initSpeakersDirectory();

	}

	// Run functions on load
	pageFunctions();


	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Menu

	$(document).on('click', '.js-menu-toggle', function (){

		// If already open
		if ( $('body').hasClass('menu--open') ) {
			$('body').removeClass('menu--open');
			$('.js-menu-toggle').attr('aria-expanded', 'false');
		}

		// If not open
		else {
			$('body').addClass('menu--open');
			$('.js-menu-toggle').attr('aria-expanded', 'true');
		}
	});

	$(document).on('click', '.menu__list__item__link', function (){

		// If menu is open when you click a link on mobile
		if ( $('body').hasClass('menu--open') ) {
			$('body').removeClass('menu--open');
			$('.js-menu-toggle').attr('aria-expanded', 'false');
		}
	});



	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Listing post click

	// Click anywhere on the post to go to the link
	$(document).on('click', '.post', function (){

		var targetPost = $(this).find('.post__title a').attr('href');

		if ( $('body').hasClass('ajax-loading') ) {

			// Change navTarget
			navTarget = targetPost;
			
			// Switch the URL via History
			History.pushState(null, docTitle, targetPost);
		}

		else {
			// Use the given link
				window.location = targetPost;
		}
	});



	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Contact Form

	// Override the submit event
	$(document).on('submit', '#contact-form', function (e) {

		// Clear previous classes
		$('.contact-form__item--error').removeClass('contact-form__item--error');

		// Get form elements
		var emailField = $('.contact-form__input[name="email"]');
		var nameField = $('.contact-form__input[name="name"]');
		var messageField = $('.contact-form__textarea[name="message"]');
		var gotchaField = $('.contact-form__gotcha');

		// Validate email
		if ( emailField.val() === '' ) {
			emailField.closest('.contact-form__item').addClass('contact-form__item--error');
		}

		// Validate name
		if ( nameField.val() === '' ) {
			nameField.closest('.contact-form__item').addClass('contact-form__item--error');
		}

		// Validate message
		if ( messageField.val() === '' ) {
			messageField.closest('.contact-form__item').addClass('contact-form__item--error');
		}

		// If all fields are filled, except gotcha
		if ( emailField.val() !== '' && nameField.val() !== '' && messageField.val() !== '' && gotchaField.val().length === 0 ) {

			// Submit the form!
		}

		else {

			// Stop submission
			e.preventDefault();
		}

	});
	
	
	
}(jQuery));