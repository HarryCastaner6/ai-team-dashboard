'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Plus, Search, Filter, File, Folder, Star, Users, Edit, Trash2, Eye, FolderOpen, Hash, Clock, User, Brain, Lightbulb, HelpCircle } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

interface Article {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  categoryId: string
  categoryName: string
  tags: string[]
  status: 'draft' | 'published' | 'archived'
  views: number
  likes: number
  createdDate: Date
  lastModified: Date
  isBookmarked: boolean
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

interface Category {
  id: string
  name: string
  description: string
  icon: string
  articleCount: number
  color: string
}

interface FAQ {
  id: string
  question: string
  answer: string
  categoryId: string
  views: number
  helpful: number
  notHelpful: number
}

export default function KnowledgePage() {
  const [articles, setArticles] = useState<Article[]>([
    {
      id: '1',
      title: 'Getting Started with Project Management',
      content: 'This comprehensive guide covers the fundamentals of project management, including planning, execution, and monitoring phases. Learn best practices and methodologies that will help you deliver successful projects on time and within budget.',
      excerpt: 'Learn the fundamentals of effective project management',
      author: 'Sarah Johnson',
      categoryId: '1',
      categoryName: 'Project Management',
      tags: ['project-management', 'planning', 'agile'],
      status: 'published',
      views: 150,
      likes: 25,
      createdDate: new Date(Date.now() - 86400000),
      lastModified: new Date(Date.now() - 3600000),
      isBookmarked: true,
      difficulty: 'beginner'
    },
    {
      id: '2',
      title: 'Advanced React Patterns',
      content: 'Explore advanced patterns in React including render props, compound components, and hooks composition. This guide provides in-depth examples and best practices for building scalable React applications.',
      excerpt: 'Deep dive into advanced React development techniques',
      author: 'John Smith',
      categoryId: '2',
      categoryName: 'Development',
      tags: ['react', 'javascript', 'patterns'],
      status: 'published',
      views: 89,
      likes: 18,
      createdDate: new Date(Date.now() - 172800000),
      lastModified: new Date(Date.now() - 7200000),
      isBookmarked: false,
      difficulty: 'advanced'
    },
    {
      id: '3',
      title: 'Marketing Campaign Strategy Guide',
      content: 'A comprehensive guide to planning and executing successful marketing campaigns. Covers audience research, content creation, channel selection, and performance measurement.',
      excerpt: 'Step-by-step guide to creating effective marketing campaigns',
      author: 'Emily Davis',
      categoryId: '3',
      categoryName: 'Marketing',
      tags: ['marketing', 'campaigns', 'strategy'],
      status: 'draft',
      views: 0,
      likes: 0,
      createdDate: new Date(Date.now() - 43200000),
      lastModified: new Date(Date.now() - 1800000),
      isBookmarked: false,
      difficulty: 'intermediate'
    }
  ])

  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Project Management',
      description: 'Guides and best practices for managing projects effectively',
      icon: '📋',
      articleCount: 1,
      color: '#667eea'
    },
    {
      id: '2',
      name: 'Development',
      description: 'Technical documentation and coding guidelines',
      icon: '💻',
      articleCount: 1,
      color: '#10b981'
    },
    {
      id: '3',
      name: 'Marketing',
      description: 'Marketing strategies and campaign management',
      icon: '📢',
      articleCount: 1,
      color: '#f59e0b'
    },
    {
      id: '4',
      name: 'Design',
      description: 'Design principles and creative workflows',
      icon: '🎨',
      articleCount: 0,
      color: '#ef4444'
    },
    {
      id: '5',
      name: 'Operations',
      description: 'Business operations and process documentation',
      icon: '⚙️',
      articleCount: 0,
      color: '#8b5cf6'
    }
  ])

  const [faqs] = useState<FAQ[]>([
    {
      id: '1',
      question: 'How do I create a new project in the dashboard?',
      answer: 'To create a new project, navigate to the Projects section and click the "Create Project" button. Fill in the required details and click "Save".',
      categoryId: '1',
      views: 45,
      helpful: 12,
      notHelpful: 2
    },
    {
      id: '2',
      question: 'How can I invite team members to collaborate?',
      answer: 'Go to the Team section, click "Invite Member", enter their email address, and select their role. They will receive an invitation email.',
      categoryId: '1',
      views: 38,
      helpful: 9,
      notHelpful: 1
    },
    {
      id: '3',
      question: 'What file formats are supported for documents?',
      answer: 'We support PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT, and various image formats (PNG, JPG, GIF, SVG).',
      categoryId: '4',
      views: 29,
      helpful: 7,
      notHelpful: 0
    }
  ])

  const [activeTab, setActiveTab] = useState<'articles' | 'categories' | 'faqs' | 'bookmarks'>('articles')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [showArticleModal, setShowArticleModal] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)

  const [newArticle, setNewArticle] = useState({
    title: '',
    content: '',
    excerpt: '',
    categoryId: '',
    tags: '',
    difficulty: 'beginner' as Article['difficulty']
  })

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = categoryFilter === 'all' || article.categoryId === categoryFilter
    const matchesDifficulty = difficultyFilter === 'all' || article.difficulty === difficultyFilter
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const bookmarkedArticles = articles.filter(article => article.isBookmarked)

  const getStatusColor = (status: Article['status']) => {
    switch (status) {
      case 'published': return '#10b981'
      case 'draft': return '#f59e0b'
      case 'archived': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getDifficultyColor = (difficulty: Article['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return '#10b981'
      case 'intermediate': return '#f59e0b'
      case 'advanced': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const handleCreateArticle = () => {
    if (!newArticle.title || !newArticle.content) {
      toast.error('Please fill in required fields')
      return
    }

    const category = categories.find(c => c.id === newArticle.categoryId)
    
    const article: Article = {
      id: Date.now().toString(),
      ...newArticle,
      author: 'Current User',
      categoryName: category?.name || '',
      tags: newArticle.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      status: 'draft',
      views: 0,
      likes: 0,
      createdDate: new Date(),
      lastModified: new Date(),
      isBookmarked: false
    }

    setArticles([article, ...articles])
    setCategories(prev => prev.map(cat => 
      cat.id === newArticle.categoryId 
        ? { ...cat, articleCount: cat.articleCount + 1 }
        : cat
    ))
    setNewArticle({
      title: '',
      content: '',
      excerpt: '',
      categoryId: '',
      tags: '',
      difficulty: 'beginner'
    })
    setShowArticleModal(false)
    toast.success('Article created successfully!')
  }

  const toggleBookmark = (articleId: string) => {
    setArticles(articles.map(article => 
      article.id === articleId 
        ? { ...article, isBookmarked: !article.isBookmarked }
        : article
    ))
    toast.success('Bookmark updated!')
  }

  const totalViews = articles.reduce((sum, article) => sum + article.views, 0)
  const publishedArticles = articles.filter(article => article.status === 'published').length

  return (
    <div>
      <div className="section-header">
        <h2>
          <BookOpen size={40} />
          Knowledge Base & Wiki
        </h2>
        <p>Centralized knowledge management and documentation system</p>
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={() => setShowArticleModal(true)}
            className="nav-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={20} />
            <span>New Article</span>
          </button>
        </div>
      </div>

      {/* Knowledge Overview Cards */}
      <div className="analytics-grid">
        <div className="team-card">
          <div className="card-header">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
              <BookOpen size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Total Articles</div>
              <div className="member-rating">
                <div className="rating-value">{articles.length}</div>
                <div className="rating-rank">Knowledge items</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="team-card">
          <div className="card-header">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <File size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Published</div>
              <div className="member-rating">
                <div className="rating-value">{publishedArticles}</div>
                <div className="rating-rank">Live articles</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="team-card">
          <div className="card-header">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
              <Eye size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Total Views</div>
              <div className="member-rating">
                <div className="rating-value">{totalViews}</div>
                <div className="rating-rank">Page views</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="team-card">
          <div className="card-header">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
              <Folder size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Categories</div>
              <div className="member-rating">
                <div className="rating-value">{categories.length}</div>
                <div className="rating-rank">Topics</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="analytics-row">
        {/* Content Area */}
        <div className="chart-container large">
          {/* Tabs */}
          <div className="filters" style={{ marginBottom: '25px' }}>
            <button
              onClick={() => setActiveTab('articles')}
              className={activeTab === 'articles' ? 'filter-btn active' : 'filter-btn'}
            >
              Articles <span style={{ marginLeft: '8px', background: '#404040', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>{articles.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={activeTab === 'categories' ? 'filter-btn active' : 'filter-btn'}
            >
              Categories <span style={{ marginLeft: '8px', background: '#404040', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>{categories.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('faqs')}
              className={activeTab === 'faqs' ? 'filter-btn active' : 'filter-btn'}
            >
              FAQs <span style={{ marginLeft: '8px', background: '#404040', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>{faqs.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={activeTab === 'bookmarks' ? 'filter-btn active' : 'filter-btn'}
            >
              Bookmarks <span style={{ marginLeft: '8px', background: '#404040', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>{bookmarkedArticles.length}</span>
            </button>
          </div>

          {(activeTab === 'articles' || activeTab === 'bookmarks') && (
            <>
              {/* Search and Filter */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '15px', 
                marginBottom: '25px',
                flexWrap: 'wrap'
              }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
                  <Search size={16} style={{ 
                    position: 'absolute', 
                    left: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: '#999' 
                  }} />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 15px 12px 40px',
                      background: '#333333',
                      border: '1px solid #404040',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '0.9rem'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#404040'}
                  />
                </div>
                {activeTab === 'articles' && (
                  <>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      style={{
                        padding: '12px 15px',
                        background: '#333333',
                        border: '1px solid #404040',
                        borderRadius: '10px',
                        color: 'white',
                        fontSize: '0.9rem'
                      }}
                    >
                      <option value="all">All Categories</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                    <select
                      value={difficultyFilter}
                      onChange={(e) => setDifficultyFilter(e.target.value)}
                      style={{
                        padding: '12px 15px',
                        background: '#333333',
                        border: '1px solid #404040',
                        borderRadius: '10px',
                        color: 'white',
                        fontSize: '0.9rem'
                      }}
                    >
                      <option value="all">All Levels</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </>
                )}
              </div>

              {/* Articles List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {(activeTab === 'bookmarks' ? bookmarkedArticles : filteredArticles).map((article) => (
                  <div key={article.id} className="team-card" style={{ padding: '25px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                          <h4 style={{ fontWeight: 600, fontSize: '1.2rem', color: '#fbbf24' }}>
                            {article.title}
                          </h4>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            background: getStatusColor(article.status),
                            color: 'white',
                            textTransform: 'capitalize'
                          }}>
                            {article.status}
                          </span>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            background: getDifficultyColor(article.difficulty),
                            color: 'white',
                            textTransform: 'capitalize'
                          }}>
                            {article.difficulty}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '15px' }}>
                          {article.excerpt}
                        </p>
                        
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '20px', 
                          fontSize: '0.85rem', 
                          color: '#999',
                          marginBottom: '15px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <User size={14} />
                            <span>{article.author}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Folder size={14} />
                            <span>{article.categoryName}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Clock size={14} />
                            <span>{format(article.lastModified, 'MMM d, yyyy')}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Eye size={14} />
                            <span>{article.views} views</span>
                          </div>
                        </div>

                        {article.tags.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {article.tags.map((tag, index) => (
                              <span key={index} style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.75rem',
                                background: '#333333',
                                color: '#667eea',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                border: '1px solid #404040'
                              }}>
                                <Hash size={10} />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '20px' }}>
                        <button
                          onClick={() => toggleBookmark(article.id)}
                          className="action-btn"
                          style={{ 
                            background: article.isBookmarked ? '#f59e0b' : '#404040'
                          }}
                        >
                          <Star size={16} style={{ 
                            fill: article.isBookmarked ? 'white' : 'none',
                            color: article.isBookmarked ? 'white' : '#999'
                          }} />
                        </button>
                        <button
                          onClick={() => setSelectedArticle(article)}
                          className="action-btn"
                        >
                          <Eye size={16} />
                        </button>
                        <button className="action-btn">
                          <Edit size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'categories' && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: '20px' 
            }}>
              {categories.map((category) => (
                <div key={category.id} className="team-card" style={{ padding: '25px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                    <div style={{ 
                      fontSize: '2rem',
                      width: '60px',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#333333',
                      borderRadius: '15px'
                    }}>
                      {category.icon}
                    </div>
                    <div>
                      <h3 style={{ fontWeight: 600, color: '#fbbf24', fontSize: '1.1rem', marginBottom: '5px' }}>
                        {category.name}
                      </h3>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: category.color,
                        color: 'white'
                      }}>
                        {category.articleCount} articles
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#ccc' }}>
                    {category.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'faqs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fbbf24' }}>
                  Frequently Asked Questions
                </h3>
                <button 
                  className="nav-btn"
                  onClick={() => toast.success('Add FAQ clicked')}
                >
                  <Plus size={16} />
                  <span>Add FAQ</span>
                </button>
              </div>
              
              {faqs.map((faq) => (
                <div key={faq.id} className="team-card" style={{ padding: '25px' }}>
                  <h4 style={{ fontWeight: 600, color: '#fbbf24', fontSize: '1rem', marginBottom: '10px' }}>
                    {faq.question}
                  </h4>
                  <p style={{ color: '#ccc', marginBottom: '20px', lineHeight: 1.6 }}>
                    {faq.answer}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.85rem', color: '#999' }}>
                      <span>{faq.views} views</span>
                      <span>•</span>
                      <span>{faq.helpful} helpful</span>
                      <span>•</span>
                      <span>{faq.notHelpful} not helpful</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => toast.success('Marked as helpful!')}
                        className="action-btn"
                        style={{ background: '#10b981', color: 'white', fontSize: '0.8rem', padding: '6px 12px' }}
                      >
                        👍 Helpful
                      </button>
                      <button 
                        onClick={() => toast.success('Feedback recorded!')}
                        className="action-btn"
                        style={{ background: '#ef4444', color: 'white', fontSize: '0.8rem', padding: '6px 12px' }}
                      >
                        👎 Not Helpful
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Quick Actions */}
          <div className="chart-container">
            <h3>
              <Plus size={20} />
              Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
              <button 
                className="action-btn" 
                style={{ width: '100%' }}
                onClick={() => setShowArticleModal(true)}
              >
                <BookOpen size={16} />
                <span>New Article</span>
              </button>
              <button 
                className="action-btn" 
                style={{ width: '100%' }}
                onClick={() => toast.success('Create FAQ clicked')}
              >
                <HelpCircle size={16} />
                <span>Add FAQ</span>
              </button>
              <button 
                className="action-btn" 
                style={{ width: '100%' }}
                onClick={() => toast.success('Import content clicked')}
              >
                <File size={16} />
                <span>Import Content</span>
              </button>
            </div>
          </div>

          {/* Popular Articles */}
          <div className="chart-container">
            <h3>
              <Lightbulb size={20} />
              Popular Articles
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
              {articles
                .filter(a => a.status === 'published')
                .sort((a, b) => b.views - a.views)
                .slice(0, 3)
                .map((article, index) => (
                  <div key={article.id} className="team-card" style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: getDifficultyColor(article.difficulty)
                      }} />
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '0.85rem', color: '#ccc', display: 'block' }}>
                          {article.title.length > 25 ? article.title.substring(0, 25) + '...' : article.title}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#999' }}>
                          {article.views} views
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Knowledge Stats */}
          <div className="chart-container">
            <h3>
              <Brain size={20} />
              Knowledge Stats
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.8, fontSize: '0.85rem' }}>Avg. Article Length</span>
                <span style={{ fontWeight: 'bold', color: '#10b981' }}>
                  {Math.round(articles.reduce((sum, a) => sum + a.content.length, 0) / articles.length || 0)} chars
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.8, fontSize: '0.85rem' }}>Bookmarked</span>
                <span style={{ fontWeight: 'bold', color: '#f59e0b' }}>
                  {bookmarkedArticles.length}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.8, fontSize: '0.85rem' }}>Total Likes</span>
                <span style={{ fontWeight: 'bold', color: '#667eea' }}>
                  {articles.reduce((sum, a) => sum + a.likes, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Article Modal */}
      {showArticleModal && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(0, 0, 0, 0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 50, 
          padding: '20px' 
        }}>
          <div style={{ 
            background: '#2a2a2a', 
            borderRadius: '15px', 
            padding: '30px', 
            width: '100%', 
            maxWidth: '800px',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '1px solid #404040'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fbbf24', marginBottom: '25px' }}>
              Create New Article
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#ccc', marginBottom: '8px' }}>
                  Title *
                </label>
                <input
                  type="text"
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    background: '#333333',
                    border: '1px solid #404040',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '0.9rem'
                  }}
                  placeholder="Article title"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#ccc', marginBottom: '8px' }}>
                  Excerpt
                </label>
                <input
                  type="text"
                  value={newArticle.excerpt}
                  onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    background: '#333333',
                    border: '1px solid #404040',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '0.9rem'
                  }}
                  placeholder="Brief description of the article"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: '#ccc', marginBottom: '8px' }}>
                    Category
                  </label>
                  <select
                    value={newArticle.categoryId}
                    onChange={(e) => setNewArticle({ ...newArticle, categoryId: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      background: '#333333',
                      border: '1px solid #404040',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: '#ccc', marginBottom: '8px' }}>
                    Difficulty
                  </label>
                  <select
                    value={newArticle.difficulty}
                    onChange={(e) => setNewArticle({ ...newArticle, difficulty: e.target.value as Article['difficulty'] })}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      background: '#333333',
                      border: '1px solid #404040',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#ccc', marginBottom: '8px' }}>
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newArticle.tags}
                  onChange={(e) => setNewArticle({ ...newArticle, tags: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    background: '#333333',
                    border: '1px solid #404040',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '0.9rem'
                  }}
                  placeholder="react, javascript, tutorial"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#ccc', marginBottom: '8px' }}>
                  Content *
                </label>
                <textarea
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    background: '#333333',
                    border: '1px solid #404040',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '0.9rem',
                    minHeight: '200px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  placeholder="Write your article content here..."
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
              <button
                onClick={() => setShowArticleModal(false)}
                className="filter-btn"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateArticle}
                className="nav-btn"
                style={{ flex: 1 }}
              >
                Create Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Article Details Modal */}
      {selectedArticle && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(0, 0, 0, 0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 50, 
          padding: '20px' 
        }}>
          <div style={{ 
            background: '#2a2a2a', 
            borderRadius: '15px', 
            padding: '30px', 
            width: '100%', 
            maxWidth: '900px',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '1px solid #404040'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#fbbf24' }}>
                    {selectedArticle.title}
                  </h3>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: getStatusColor(selectedArticle.status),
                    color: 'white'
                  }}>
                    {selectedArticle.status}
                  </span>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: getDifficultyColor(selectedArticle.difficulty),
                    color: 'white'
                  }}>
                    {selectedArticle.difficulty}
                  </span>
                </div>
                <p style={{ color: '#ccc', marginBottom: '15px' }}>{selectedArticle.excerpt}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.85rem', color: '#999' }}>
                  <span>By {selectedArticle.author}</span>
                  <span>•</span>
                  <span>{selectedArticle.categoryName}</span>
                  <span>•</span>
                  <span>{format(selectedArticle.lastModified, 'MMM d, yyyy')}</span>
                  <span>•</span>
                  <span>{selectedArticle.views} views</span>
                  <span>•</span>
                  <span>{selectedArticle.likes} likes</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                style={{ 
                  color: '#999', 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '1.5rem', 
                  cursor: 'pointer',
                  padding: '0',
                  marginLeft: '20px'
                }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ 
              background: '#333333', 
              padding: '25px', 
              borderRadius: '12px',
              marginBottom: '25px'
            }}>
              <p style={{ color: '#ccc', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {selectedArticle.content}
              </p>
            </div>

            {selectedArticle.tags.length > 0 && (
              <div style={{ marginBottom: '25px' }}>
                <h4 style={{ fontWeight: 600, color: '#fbbf24', marginBottom: '10px' }}>Tags</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedArticle.tags.map((tag, index) => (
                    <span key={index} style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.75rem',
                      background: '#333333',
                      color: '#667eea',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      border: '1px solid #404040'
                    }}>
                      <Hash size={10} />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              paddingTop: '25px',
              borderTop: '1px solid #404040'
            }}>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button 
                  onClick={() => toast.success('Article liked!')}
                  className="action-btn"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>👍</span>
                  <span>Like ({selectedArticle.likes})</span>
                </button>
                <button
                  onClick={() => toggleBookmark(selectedArticle.id)}
                  className="action-btn"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    background: selectedArticle.isBookmarked ? '#f59e0b' : '#404040'
                  }}
                >
                  <Star size={16} style={{ 
                    fill: selectedArticle.isBookmarked ? 'white' : 'none',
                    color: selectedArticle.isBookmarked ? 'white' : '#999'
                  }} />
                  <span>{selectedArticle.isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                </button>
              </div>
              <button className="filter-btn">
                Edit Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}