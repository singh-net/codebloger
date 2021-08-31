using System;
using System.Collections.Generic;

namespace API.Entities
{
    public class Article
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Slug { get; set; }
        public string Description { get; set; }
        public string Content { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.Now;
        public DateTime DateUpdated { get; set; }
        public bool IsPublished { get; set; }
        public bool IsFeatured { get; set; }
        public int AppUserId { get; set; }
        public AppUser AppUser { get; set; }
        public int ViewCount { get; set; }
        public int SaveCount { get; set; }
        public ICollection<Photo> Photos { get; set; }
        public string PhotoUrl { get; set; }
        public ICollection<ArticleCategory> ArticleCategories { get; set; }
        public ICollection<ArticleLike> LikedArticles { get; set; }
        public ICollection<Comment> Comments { get; set; }


    }
}