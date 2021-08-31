using System;

namespace API.Dtos
{
    public class CommentDto
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime Created { get; set; }
        public int AppUserId { get; set; }
        public int ArticleId { get; set; }
        public int ParentId { get; set; }
        public string Username { get; set; }
        public string UserFullName { get; set; }
        public string UserPhotoUrl { get; set; }    
            


    }
}