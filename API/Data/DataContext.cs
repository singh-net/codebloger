using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : IdentityDbContext<AppUser, AppRole, int, IdentityUserClaim<int>, AppUserRole,
                                IdentityUserLogin<int>, IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Article> Articles { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<UserPhoto> UserPhotos { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<ArticleCategory> ArticleCategories { get; set; }
        public DbSet<ArticleLike> ArticleLikes { get; set; }
        public DbSet<UserFollow> UserFollows { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Activity> Activities { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<AppUser>()
                    .HasMany(ur => ur.UserRoles)
                    .WithOne(u => u.User)
                    .HasForeignKey(ur => ur.UserId)
                    .IsRequired();

            builder.Entity<AppRole>()
                     .HasMany(ur => ur.UserRoles)
                     .WithOne(u => u.Role)
                     .HasForeignKey(ur => ur.RoleId)
                     .IsRequired();

            //One to many relation with Articles(Many) and User(One)
            builder.Entity<AppUser>()
                    .HasMany(a => a.Articles)
                    .WithOne(u => u.AppUser)
                    .HasForeignKey(k => k.AppUserId);

            // //One to many relation with Photo(Many) and User(One)
            builder.Entity<AppUser>()
                    .HasMany(p => p.UserPhotos)
                    .WithOne(u => u.AppUser)
                    .HasForeignKey(k => k.AppUserId)
                    .OnDelete(DeleteBehavior.Cascade);

            // //One to many relation with Photo(Many) and Article(One)
            builder.Entity<Article>()
                    .HasMany(p => p.Photos)
                    .WithOne(a => a.Article)
                    .HasForeignKey(k => k.ArticleId);

            //One to many relation with commnent(many) and Article(One) AppUser(one)

            builder.Entity<Article>()
                        .HasMany(c => c.Comments)
                        .WithOne(a => a.Article)
                        .HasForeignKey(k => k.ArticleId)
                        .OnDelete(DeleteBehavior.Cascade);


            builder.Entity<AppUser>()
                        .HasMany(c => c.Comments)
                        .WithOne(u => u.AppUser)
                        .HasForeignKey(k => k.AppUserId)
                        .OnDelete(DeleteBehavior.NoAction);



            // //Many to many relation with Category(Many) and Article(Many)
            builder.Entity<ArticleCategory>()
                    .HasKey(ac => new { ac.ArticleId, ac.CategoryId });

            builder.Entity<ArticleCategory>()
                    .HasOne(a => a.Article)
                    .WithMany(ac => ac.ArticleCategories)
                    .HasForeignKey(a => a.ArticleId);

            builder.Entity<ArticleCategory>()
                    .HasOne(c => c.Category)
                    .WithMany(ac => ac.ArticleCategories)
                    .HasForeignKey(c => c.CategoryId);


            //Many to many relation with article and user
            builder.Entity<ArticleLike>()
                    .HasKey(k => new { k.AppUserId, k.ArticleId });
            builder.Entity<ArticleLike>()
                   .HasOne(u => u.AppUser)
                   .WithMany(a => a.LikedArticles)
                   .HasForeignKey(k => k.AppUserId)
                   .OnDelete(DeleteBehavior.ClientCascade);
            builder.Entity<ArticleLike>()
                   .HasOne(a => a.Article)
                   .WithMany(u => u.LikedArticles)
                   .HasForeignKey(k => k.ArticleId)
                   .OnDelete(DeleteBehavior.ClientCascade);


            //Many to many relation with followers and followedusers

            builder.Entity<UserFollow>()
                    .HasKey(k => new { k.SourceUserId, k.FollowedUserId });
            builder.Entity<UserFollow>()
                    .HasOne(s => s.SourceUser)
                    .WithMany(l => l.FollowedUsers)
                    .HasForeignKey(s => s.SourceUserId)
                    .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<UserFollow>()
                    .HasOne(s => s.FollowedUser)
                    .WithMany(l => l.FollowedByUsers)
                    .HasForeignKey(s => s.FollowedUserId)
                    .OnDelete(DeleteBehavior.NoAction);


            //Many to many relation with article and user
            //     builder.Entity<ArticleLike>()
            //             .HasKey(k => new { k.AppUserId, k.ArticleId });
            //     builder.Entity<ArticleLike>()
            //            .HasOne(u => u.AppUser)
            //            .WithMany(a => a.LikedArticles)
            //            .HasForeignKey(k => k.AppUserId)
            //            .OnDelete(DeleteBehavior.ClientCascade);
            //     builder.Entity<ArticleLike>()
            //            .HasOne(a => a.Article)
            //            .WithMany(u => u.LikedArticles)
            //            .HasForeignKey(k => k.ArticleId)
            //            .OnDelete(DeleteBehavior.ClientCascade);




            // Many to many relation with Activity and Users

            //     builder.Entity<Activity>()
            //             .HasKey(k => new { k.SenderUserId, k.ReceiverUserId });

            //     builder.Entity<Activity>()
            //             .HasOne(x => x.SenderUser)
            //             .WithMany(a => a.Activities)
            //             .HasForeignKey(k => k.SenderUserId)
            //             .OnDelete(DeleteBehavior.ClientCascade);

            //     builder.Entity<Activity>()
            //             .HasOne(r => r.ReceiverUser)
            //             .WithMany(a => a.Activities)
            //             .HasForeignKey(k => k.ReceiverUserId)
            //             .OnDelete(DeleteBehavior.ClientCascade);


        }

    }
}