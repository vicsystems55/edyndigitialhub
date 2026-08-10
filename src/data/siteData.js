import {
  BarChart3, DraftingCompass, Globe2, GraduationCap, Megaphone,
  Palette, PenTool, Rocket, Search, Send, SlidersHorizontal, Target, Users,
} from '@lucide/vue'

export const services = [
  { title: 'Social Media Management', text: 'Strategy, content, community management, and growth solutions.', icon: Users },
  { title: 'Branding & Brand Strategy', text: 'Clear identities that connect, communicate, and convert.', icon: PenTool },
  { title: 'Graphic Design', text: 'Creative design that inspires, engages, and elevates your brand.', icon: Palette },
  { title: 'UI/UX Design', text: 'Thoughtful, user-centered interfaces and seamless digital experiences.', icon: DraftingCompass },
  { title: 'Website Solutions', text: 'Modern responsive websites that position your brand for success.', icon: Globe2 },
  { title: 'Digital Marketing Support', text: 'Smarter strategies designed to grow your audience and visibility.', icon: Megaphone },
  { title: 'Educational Resources', text: 'Curriculum-aligned worksheets, activity books, and learning tools.', icon: GraduationCap },
  { title: 'Business Consulting', text: 'Practical guidance and digital systems for sustainable growth.', icon: BarChart3 },
]

export const process = [
  { number: '01', title: 'Discover', text: 'We understand your vision, audience, needs, and goals.', icon: Search },
  { number: '02', title: 'Strategy', text: 'We create a clear, purposeful roadmap tailored to you.', icon: Target },
  { number: '03', title: 'Create', text: 'We bring ideas to life with creativity and expertise.', icon: PenTool },
  { number: '04', title: 'Refine', text: 'We review, test, and perfect every meaningful detail.', icon: SlidersHorizontal },
  { number: '05', title: 'Deliver', text: 'We deliver polished solutions ready for implementation.', icon: Send },
  { number: '06', title: 'Grow', text: 'We support your long-term progress and success.', icon: Rocket },
]

export const projects = [
  { slug: 'brand-identity-system', title: 'Brand Identity System', category: 'Branding', className: 'project-green', summary: 'A confident visual direction designed to give a growing business clarity and recognition.', services: ['Brand strategy', 'Visual identity', 'Brand guidelines'] },
  { slug: 'growth-campaign', title: 'Growth Campaign', category: 'Social Media', className: 'project-yellow', summary: 'A structured content campaign designed to build consistency, engagement, and visibility.', services: ['Content strategy', 'Campaign design', 'Social media'] },
  { slug: 'edyn-learning-series', title: 'Edyn Learning Series', category: 'Educational', className: 'project-cream', summary: 'A flexible educational product system for engaging, curriculum-aligned learning resources.', services: ['Curriculum planning', 'Worksheet design', 'Product system'] },
  { slug: 'business-website', title: 'Business Website', category: 'Websites', className: 'project-deep', summary: 'A focused digital experience that clearly communicates value and guides visitors to action.', services: ['UX strategy', 'UI design', 'Web development'] },
  { slug: 'corporate-profile', title: 'Corporate Profile', category: 'Corporate Documents', className: 'project-green', summary: 'A polished company profile that makes complex information clear, credible, and engaging.', services: ['Content structure', 'Editorial design', 'Presentation'] },
  { slug: 'mobile-product-concept', title: 'Mobile Product Concept', category: 'UI/UX', className: 'project-yellow', summary: 'A user-centered mobile interface shaped around clarity, flow, and everyday usability.', services: ['User flows', 'Wireframes', 'Interface design'] },
  { slug: 'launch-visual-system', title: 'Launch Visual System', category: 'Graphic Design', className: 'project-cream', summary: 'A coordinated visual toolkit for a memorable and consistent product launch.', services: ['Art direction', 'Campaign assets', 'Templates'] },
  { slug: 'education-content-campaign', title: 'Education Content Campaign', category: 'Social Media', className: 'project-deep', summary: 'An informative campaign that turns educational expertise into accessible social content.', services: ['Content planning', 'Graphic design', 'Copy direction'] },
]

export const resourceArticles = [
  { category: 'Branding', title: 'How to Build a Brand People Remember', excerpt: 'Practical foundations for creating a clear, consistent, and meaningful brand.', readTime: '6 min read' },
  { category: 'Social Media', title: 'A Simple Content System for Busy Founders', excerpt: 'Plan useful content without letting social media consume your entire week.', readTime: '5 min read' },
  { category: 'AI & Creativity', title: 'Using AI Without Losing Your Creative Voice', excerpt: 'A responsible framework for making AI support—not replace—original thinking.', readTime: '7 min read' },
  { category: 'Education', title: 'What Makes a Worksheet Truly Effective?', excerpt: 'Design principles that improve clarity, participation, and learning outcomes.', readTime: '5 min read' },
  { category: 'Digital Business', title: 'Your Digital Presence Needs a System', excerpt: 'Connect your website, content, brand, and customer journey into one useful ecosystem.', readTime: '8 min read' },
  { category: 'Design', title: 'Designing for Clarity Before Decoration', excerpt: 'Why strong communication is the foundation of every successful visual asset.', readTime: '4 min read' },
]
