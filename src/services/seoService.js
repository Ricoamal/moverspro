// SEO Service for Website Builder
class SEOService {
  constructor() {
    this.defaultSettings = {
      title: '',
      description: '',
      keywords: '',
      author: 'MoveEase Pro',
      robots: 'index, follow',
      canonical: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: '',
      twitterDescription: '',
      twitterImage: '',
      structuredData: null
    };
  }

  // Generate SEO-friendly title
  generateTitle(pageTitle, siteName = 'MoveEase Pro') {
    if (!pageTitle) return siteName;
    
    // Optimize title length (50-60 characters)
    const maxLength = 60;
    let title = `${pageTitle} | ${siteName}`;
    
    if (title.length > maxLength) {
      title = pageTitle.length > maxLength - 3 
        ? `${pageTitle.substring(0, maxLength - 3)}...`
        : pageTitle;
    }
    
    return title;
  }

  // Generate meta description
  generateDescription(content, maxLength = 160) {
    if (!content) return '';
    
    // Clean HTML tags and extra whitespace
    const cleanContent = content
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (cleanContent.length <= maxLength) {
      return cleanContent;
    }
    
    // Truncate at word boundary
    const truncated = cleanContent.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    return lastSpace > maxLength * 0.8 
      ? `${truncated.substring(0, lastSpace)}...`
      : `${truncated}...`;
  }

  // Extract keywords from content
  extractKeywords(content, maxKeywords = 10) {
    if (!content) return [];
    
    // Common moving industry keywords
    const movingKeywords = [
      'moving', 'relocation', 'movers', 'packing', 'storage', 'transport',
      'residential', 'commercial', 'office', 'home', 'kenya', 'nairobi',
      'professional', 'reliable', 'affordable', 'insured', 'experienced'
    ];
    
    // Clean and split content
    const words = content
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    // Count word frequency
    const wordCount = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    // Prioritize moving-related keywords
    const keywords = Object.entries(wordCount)
      .map(([word, count]) => ({
        word,
        count,
        priority: movingKeywords.includes(word) ? count * 2 : count
      }))
      .sort((a, b) => b.priority - a.priority)
      .slice(0, maxKeywords)
      .map(item => item.word);
    
    return keywords;
  }

  // Generate structured data for moving company
  generateMovingCompanyStructuredData(pageData) {
    const baseStructuredData = {
      "@context": "https://schema.org",
      "@type": "MovingCompany",
      "name": "MoveEase Pro",
      "description": "Professional moving services in Kenya",
      "url": window.location.origin,
      "telephone": "+254-700-123-456",
      "email": "info@moveeasepro.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Moving Street",
        "addressLocality": "Nairobi",
        "addressCountry": "Kenya"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "-1.2921",
        "longitude": "36.8219"
      },
      "openingHours": "Mo-Sa 08:00-18:00",
      "priceRange": "$$",
      "serviceArea": {
        "@type": "Country",
        "name": "Kenya"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Moving Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Residential Moving",
              "description": "Professional home relocation services"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Office Relocation",
              "description": "Commercial and office moving services"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Storage Services",
              "description": "Secure storage and warehousing solutions"
            }
          }
        ]
      }
    };

    // Add page-specific data
    if (pageData.title) {
      baseStructuredData.name = pageData.title;
    }
    
    if (pageData.description) {
      baseStructuredData.description = pageData.description;
    }

    return baseStructuredData;
  }

  // Generate breadcrumb structured data
  generateBreadcrumbStructuredData(breadcrumbs) {
    if (!breadcrumbs || breadcrumbs.length === 0) return null;

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url
      }))
    };
  }

  // Analyze page SEO
  analyzePage(pageData) {
    const analysis = {
      score: 0,
      issues: [],
      suggestions: [],
      warnings: []
    };

    let score = 0;
    const maxScore = 100;

    // Title analysis
    if (!pageData.title) {
      analysis.issues.push('Missing page title');
    } else {
      score += 15;
      if (pageData.title.length < 30) {
        analysis.warnings.push('Title is too short (recommended: 30-60 characters)');
      } else if (pageData.title.length > 60) {
        analysis.warnings.push('Title is too long (recommended: 30-60 characters)');
      } else {
        score += 5;
      }
    }

    // Description analysis
    if (!pageData.description) {
      analysis.issues.push('Missing meta description');
    } else {
      score += 15;
      if (pageData.description.length < 120) {
        analysis.warnings.push('Description is too short (recommended: 120-160 characters)');
      } else if (pageData.description.length > 160) {
        analysis.warnings.push('Description is too long (recommended: 120-160 characters)');
      } else {
        score += 5;
      }
    }

    // Keywords analysis
    if (!pageData.keywords || pageData.keywords.length === 0) {
      analysis.suggestions.push('Add relevant keywords for better SEO');
    } else {
      score += 10;
    }

    // Image alt text analysis
    const imagesWithoutAlt = this.findImagesWithoutAlt(pageData.content);
    if (imagesWithoutAlt > 0) {
      analysis.issues.push(`${imagesWithoutAlt} images missing alt text`);
    } else {
      score += 10;
    }

    // Heading structure analysis
    const headingIssues = this.analyzeHeadingStructure(pageData.content);
    if (headingIssues.length > 0) {
      analysis.warnings.push(...headingIssues);
    } else {
      score += 10;
    }

    // Content length analysis
    const wordCount = this.getWordCount(pageData.content);
    if (wordCount < 300) {
      analysis.warnings.push('Content is too short (recommended: 300+ words)');
    } else {
      score += 10;
    }

    // Internal links analysis
    const internalLinks = this.countInternalLinks(pageData.content);
    if (internalLinks === 0) {
      analysis.suggestions.push('Add internal links to improve navigation');
    } else {
      score += 5;
    }

    // Mobile-friendly analysis
    score += 10; // Assuming responsive design

    // Page speed (placeholder)
    score += 10; // Would need actual performance metrics

    analysis.score = Math.round((score / maxScore) * 100);

    // Add general suggestions
    if (analysis.score < 70) {
      analysis.suggestions.push('Focus on fixing critical SEO issues first');
    }
    
    if (analysis.score >= 80) {
      analysis.suggestions.push('Great SEO! Consider advanced optimizations');
    }

    return analysis;
  }

  // Helper methods
  findImagesWithoutAlt(content) {
    if (!content) return 0;
    const imgTags = content.match(/<img[^>]*>/gi) || [];
    return imgTags.filter(img => !img.includes('alt=')).length;
  }

  analyzeHeadingStructure(content) {
    if (!content) return [];
    
    const issues = [];
    const headings = content.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi) || [];
    
    if (headings.length === 0) {
      issues.push('No headings found - add H1, H2, etc. for better structure');
      return issues;
    }

    const h1Count = (content.match(/<h1[^>]*>/gi) || []).length;
    if (h1Count === 0) {
      issues.push('Missing H1 tag - add a main heading');
    } else if (h1Count > 1) {
      issues.push('Multiple H1 tags found - use only one H1 per page');
    }

    return issues;
  }

  getWordCount(content) {
    if (!content) return 0;
    return content
      .replace(/<[^>]*>/g, '')
      .split(/\s+/)
      .filter(word => word.length > 0)
      .length;
  }

  countInternalLinks(content) {
    if (!content) return 0;
    const links = content.match(/<a[^>]*href=["'][^"']*["'][^>]*>/gi) || [];
    return links.filter(link => 
      !link.includes('http://') && 
      !link.includes('https://') && 
      !link.includes('mailto:') && 
      !link.includes('tel:')
    ).length;
  }

  // Generate sitemap data
  generateSitemap(pages) {
    const baseUrl = window.location.origin;
    
    return pages
      .filter(page => page.status === 'published')
      .map(page => ({
        url: `${baseUrl}/${page.slug}`,
        lastmod: page.updatedAt,
        changefreq: 'weekly',
        priority: page.slug === 'home' ? '1.0' : '0.8'
      }));
  }

  // Generate robots.txt content
  generateRobotsTxt() {
    const baseUrl = window.location.origin;
    
    return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Block admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /website-builder/

# Allow important pages
Allow: /
Allow: /services/
Allow: /about/
Allow: /contact/
Allow: /quote/`;
  }
}

// Create singleton instance
const seoService = new SEOService();
export default seoService;
