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
    title: 'Discovering the Hidden Gems of Mozambique\'s Coast',
    excerpt: 'Explore the pristine beaches and untouched beauty of Mozambique\'s coastline, from Barra to Tofo.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=400&fit=crop',
    date: 'January 15, 2023',
    author: 'Jaco Ligthelm',
    category: 'Travel',
    tags: ['Mozambique', 'Beach', 'Travel']
  },
  {
    id: 2,
    title: 'Luxury Beach House Design: Creating Your Perfect Getaway',
    excerpt: 'Discover the art of designing luxury beach houses that blend comfort, style, and natural beauty.',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=400&fit=crop',
    date: 'February 22, 2023',
    author: 'Mariska van der Merwe',
    category: 'Design',
    tags: ['Interior Design', 'Beach House', 'Luxury']
  },
  {
    id: 3,
    title: 'Sustainable Tourism in Mozambique: Our Commitment',
    excerpt: 'Learn about our commitment to sustainable tourism and how we protect the natural beauty of Barra.',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop',
    date: 'March 10, 2023',
    author: 'Jaco Ligthelm',
    category: 'Sustainability',
    tags: ['Sustainability', 'Environment', 'Tourism']
  },
  {
    id: 4,
    title: 'The Best Activities and Excursions in Barra',
    excerpt: 'Discover the amazing activities and excursions available in Barra, from snorkeling to cultural tours.',
    image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800&h=400&fit=crop',
    date: 'April 5, 2023',
    author: 'Jaco Ligthelm',
    category: 'Activities',
    tags: ['Activities', 'Excursions', 'Adventure']
  },
  {
    id: 5,
    title: 'Planning Your Perfect Beach Vacation in Mozambique',
    excerpt: 'Essential tips for planning an unforgettable beach vacation in Mozambique, from packing to local customs.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
    date: 'May 18, 2023',
    author: 'Mariska van der Merwe',
    category: 'Travel Tips',
    tags: ['Travel', 'Planning', 'Vacation']
  },
  {
    id: 6,
    title: 'Local Culture and Cuisine: Experiencing Authentic Mozambique',
    excerpt: 'Immerse yourself in the rich culture and delicious cuisine of Mozambique during your stay.',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=400&fit=crop',
    date: 'June 30, 2023',
    author: 'Jaco Ligthelm',
    category: 'Culture',
    tags: ['Culture', 'Cuisine', 'Local Experience']
  }
];

const categories = [
  'All',
  'Travel',
  'Design',
  'Sustainability',
  'Activities',
  'Travel Tips',
  'Culture'
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
                {['Beach', 'Luxury', 'Mozambique', 'Travel', 'Adventure', 'Culture', 'Sustainability', 'Romance'].map((tag) => (
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
