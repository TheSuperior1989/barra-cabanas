import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCalendarAlt, faUser, faTag } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './BlogPage.css';

// Sample blog posts data (in a real app, this would come from an API or CMS)
const blogPosts = [
  {
    id: 1,
    title: 'The Future of CNC Manufacturing: Trends to Watch',
    excerpt: 'Explore the latest trends in CNC manufacturing and how they are shaping the future of the industry.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop',
    date: 'January 15, 2023',
    author: 'Christiaan Von Stade',
    category: 'Engineering',
    tags: ['CNC', 'Manufacturing', 'Technology']
  },
  {
    id: 2,
    title: 'Web Design Trends That Will Dominate in 2023',
    excerpt: 'Stay ahead of the curve with these web design trends that are set to dominate the digital landscape in 2023.',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=400&fit=crop',
    date: 'February 22, 2023',
    author: 'Sure Von Stade',
    category: 'Web Development',
    tags: ['Web Design', 'UI/UX', 'Trends']
  },
  {
    id: 3,
    title: 'How to Create a Successful Social Media Strategy',
    excerpt: 'Learn the key components of a successful social media strategy and how to implement them for your business.',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop',
    date: 'March 10, 2023',
    author: 'Sure Von Stade',
    category: 'Digital Marketing',
    tags: ['Social Media', 'Marketing', 'Strategy']
  },
  {
    id: 4,
    title: 'The Importance of Brand Consistency Across All Platforms',
    excerpt: 'Discover why maintaining brand consistency across all platforms is crucial for building a strong brand identity.',
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=400&fit=crop',
    date: 'April 5, 2023',
    author: 'Sure Von Stade',
    category: 'Graphic Design',
    tags: ['Branding', 'Design', 'Marketing']
  },
  {
    id: 5,
    title: 'Mobile App Development: Native vs. Cross-Platform',
    excerpt: 'Compare the pros and cons of native and cross-platform mobile app development to determine which is right for your project.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop',
    date: 'May 18, 2023',
    author: 'Christiaan Von Stade',
    category: 'Software Development',
    tags: ['Mobile Apps', 'Development', 'Technology']
  },
  {
    id: 6,
    title: 'Optimizing Your Website for Search Engines in 2023',
    excerpt: 'Learn the latest SEO techniques to optimize your website and improve your search engine rankings in 2023.',
    image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&h=400&fit=crop',
    date: 'June 30, 2023',
    author: 'Sure Von Stade',
    category: 'Digital Marketing',
    tags: ['SEO', 'Web Development', 'Marketing']
  }
];

const categories = [
  'All',
  'Engineering',
  'Web Development',
  'Digital Marketing',
  'Graphic Design',
  'Software Development'
];

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="blog-page">
      <div className="blog-hero">
        <div className="blog-hero-overlay"></div>
        <div className="container">
          <h1 className="blog-hero-title">Our Blog</h1>
          <p className="blog-hero-subtitle">
            Insights, tips, and trends from our experts
          </p>
        </div>
      </div>

      <section className="blog-content">
        <div className="container">
          <div className="blog-sidebar">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button className="search-btn">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>

            <div className="categories-box">
              <h3>Categories</h3>
              <ul className="categories-list">
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      className={activeCategory === category ? 'active' : ''}
                      onClick={() => handleCategoryChange(category)}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="recent-posts">
              <h3>Recent Posts</h3>
              <ul className="recent-posts-list">
                {blogPosts.slice(0, 3).map((post) => (
                  <li key={post.id}>
                    <Link to={`/blog/${post.id}`} className="recent-post">
                      <div className="recent-post-image">
                        <img src={post.image} alt={post.title} />
                      </div>
                      <div className="recent-post-info">
                        <h4>{post.title}</h4>
                        <span className="recent-post-date">
                          <FontAwesomeIcon icon={faCalendarAlt} /> {post.date}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="tags-box">
              <h3>Popular Tags</h3>
              <div className="tags-list">
                {['CNC', 'Web Design', 'Marketing', 'Branding', 'Technology', 'Development', 'SEO', 'UI/UX'].map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="blog-main">
            <motion.div
              ref={ref}
              variants={containerVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="blog-grid"
            >
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <motion.div key={post.id} className="blog-card" variants={itemVariants}>
                    <div className="blog-image">
                      <img src={post.image} alt={post.title} />
                      <div className="blog-category">{post.category}</div>
                    </div>
                    <div className="blog-content">
                      <h2 className="blog-title">
                        <Link to={`/blog/${post.id}`}>{post.title}</Link>
                      </h2>
                      <div className="blog-meta">
                        <span className="blog-date">
                          <FontAwesomeIcon icon={faCalendarAlt} /> {post.date}
                        </span>
                        <span className="blog-author">
                          <FontAwesomeIcon icon={faUser} /> {post.author}
                        </span>
                      </div>
                      <p className="blog-excerpt">{post.excerpt}</p>
                      <div className="blog-tags">
                        {post.tags.map((tag, index) => (
                          <span key={index} className="blog-tag">
                            <FontAwesomeIcon icon={faTag} /> {tag}
                          </span>
                        ))}
                      </div>
                      <Link to={`/blog/${post.id}`} className="read-more">
                        Read More
                      </Link>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="no-results">
                  <h3>No posts found</h3>
                  <p>Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
