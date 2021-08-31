using System;

namespace API.Entities
{
    public class Comment
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime Created { get; set; } = DateTime.Now;
        public AppUser AppUser { get; set; }
        public int AppUserId { get; set; }
        public Article Article { get; set; }
        public int ArticleId { get; set; }
        public int ParentId { get; set; }

    }
}