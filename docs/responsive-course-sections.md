# Responsive assignment sections — verified reference notes

Source of the full user brief and original reference URLs: `/home/ubuntu/upload/pasted_content_2.txt` (projects 1–12). Downloaded image URLs and local destinations are preserved in `public/responsive-course-projects/asset-manifest.json`. The reference screenshots were independently reviewed before implementation.

## Breakpoints
- Extra small: under 576px; small: 576px and above; medium: 768px and above; large: 992px and above; extra large: 1200px and above.
- Every assignment must remain usable without horizontal overflow at all breakpoints.

## Sections, visible content, and layout

1. **Ecommerce Services Section** — “Our Services”, introductory shopping paragraph, and three service cards: Fast and Free Delivery, 100% Money back guarantee, Online Support 24/7. Mobile cards stack; medium+ uses three columns. Supplied assets: delivery, money-back, support icons.
2. **Ecommerce Products Section** — “Our Products”; Smart Headphones and Laptops image cards with View Details buttons; “See All Offers”. Mobile cards stack; medium+ shows two columns. Each View Details button opens an accessible modal with product details, feature list, close control, and Buy Now button. Escape/backdrop/close dismiss the modal.
3. **Ecommerce Offers Section** — “BEST NEW YEAR SPECIAL OFFERS”, “Best time to buy. Save upto 70% cash”, “10% INSTANT DISCOUNT*”, “with SBI Credit Cards*”; special-offer badge, appliances collage and SBI card. Mobile order: badge, appliances, copy/card; medium+ places copy, badge and collage side by side on an orange-to-pink panel.
4. **Ecommerce Trending Blogs Section** — “Trending Blogs”; two cards: Fountain Pens / “Guide to Fountain Pen Nibs” and Productivity / “How to Craft a Better Todo List”, each with summary and READ MORE. Mobile one column; medium+ two columns.
5. **Ecommerce Explore Section** — “Explore Deals & Offers”; electronics grid (Smart Watch, Cameras, Sports & Fitness, Earphones), TV/appliance promotion, and accessory grid (Tablet, PlayStation, Speakers, Virtual Reality Set), each with “See All Deals”. Mobile one column, medium two columns, large+ three columns.
6. **Ecommerce Contact Us Section** — centered “Let us Join Together” heading and outlined CONTACT US call to action on #f5f7fa. Only one landscape reference is supplied, so exact breakpoint-specific changes are not established.
7. **Ecommerce Footer Section** — Fly Buy logo, four social links, New Delhi address, groups Get to know us / Contact with Us / Let Us Help You, and copyright “© 2020 by Rahul. Created with Bootstrap.” Mobile centers brand/social/address and uses a two-column link layout; medium uses two columns; large+ uses four columns.
8. **Navbar & Banner Section (Design)** — Design logo, Home/Features/Pricing/Blog/Contacts links, headline “The most flexible web design tool”, supplied supporting copy and Sign Up. Mobile menu toggles open/closed; medium retains hamburger; large+ uses horizontal links. Full-width dark marbled background.
9. **Logos Section** — “Used by and seen on”; Slack, Netflix, Fitbit, Google, Airbnb and Uber marks. Mobile 3×2 grid; medium+ one row.
10. **Design and Deliver Section** — “Design in the browser” and “Deliver Faster”, each with illustration and body copy. Mobile stacked; medium+ two columns.
11. **Tools Section** — “A visual drag and drop editor” and “Animations & Effects” with their full supplied copy and illustrations. Mobile image-then-copy stacked; medium+ two alternating image/text rows.
12. **Features Section** — “Features that make Design simply awesome”; subtitle “Not sure if Design is for you? Check out a few of the key features!”; six entries Vectors, Forms, Effects, Paste CSS, Responsive from the start, Library with supplied descriptions. Mobile one column; medium+ two columns, three rows.

All supplied image assets are stored locally under `public/responsive-course-projects/`; the Ecommerce footer reuses the existing locally stored Fly Buy logo. No remote database or runtime image dependency is needed.
