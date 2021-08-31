using System;

namespace API.Entities
{
    public class Activity
    {
        // public AppUser SenderUser { get; set; }
        public int SenderUserId { get; set; }
        public AppUser ReceiverUser { get; set; }
        public int ReceiverUserId { get; set; }
        public string Type { get; set; }
        public DateTime Created { get; set; }
        
        // public Article Article { get; set; }    
        public int ArticleId { get; set; }

    }
}