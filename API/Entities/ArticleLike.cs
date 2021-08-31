namespace API.Entities
{
    public class ArticleLike
    {
        public Article Article { get; set; }    
        public int ArticleId { get; set; }  
        public AppUser AppUser { get; set; }   
        public int AppUserId { get; set; }
    }
}