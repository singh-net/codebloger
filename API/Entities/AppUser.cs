using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppUser : IdentityUser<int>
    {
        public ICollection<AppUserRole> UserRoles { get; set; }
        public string Name { get; set; }
        public string About { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string WorkAt { get; set; }
        public string WorkAs { get; set; }
        public string GithubLink { get; set; }
        public DateTime Created { get; set; } = DateTime.Now;
        public ICollection<Article> Articles { get; set; }
        public ICollection<UserPhoto> UserPhotos { get; set; }
        public ICollection<ArticleLike> LikedArticles { get; set; }
        public ICollection<UserFollow> FollowedByUsers { get; set; }
        public ICollection<UserFollow> FollowedUsers { get; set; }
        public ICollection<Comment> Comments { get; set; }
        public ICollection<Activity> Activities { get; set; }



    }
}